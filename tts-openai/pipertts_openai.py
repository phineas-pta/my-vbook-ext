#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
my original implementation: https://gist.github.com/phineas-pta/7d08a3ac21d64e67ed5fa6b47e93c097
this version is specifically customized for vietnamese
"""

import os, argparse, json, wave, gc, logging as log, typing as t
from io import BytesIO

import onnxruntime as ort
from piper import PiperVoice, PiperConfig, SynthesisConfig
from vietnormalizer import VietnameseNormalizer

from pydantic import BaseModel, Field
from fastapi import FastAPI, Query
from fastapi.responses import Response


ort.set_default_logger_severity(3)
log.basicConfig(level=log.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s", datefmt="%Y-%m-%d %H:%M:%S")

PROVIDERS: t.Final = ort.get_available_providers()
if os.name == "nt": # windows need to search for dll
	if "OpenVINOExecutionProvider" in PROVIDERS: # https://github.com/intel/onnxruntime/releases
		import onnxruntime.tools.add_openvino_win_libs as __utils
		__utils.add_openvino_libs_to_path()
	if "CUDAExecutionProvider" in PROVIDERS: # https://onnxruntime.ai/docs/execution-providers/CUDA-ExecutionProvider.html
		ort.preload_dlls(cuda=True, cudnn=True, msvc=True, directory=os.path.join(os.environ["CUDA_PATH"], "bin"))
	if "TensorrtExecutionProvider" in PROVIDERS:
		PROVIDERS.pop(0) # cause problem if user doesn’t have TensorRT
log.info("available hardware acceleration: %s", ", ".join(PROVIDERS))


PARSER: t.Final = argparse.ArgumentParser(description=f"""
A lightweight FastAPI service that wraps Piper in an OpenAI-compatible /v1/audio/speech endpoint.
available hardware acceleration: {", ".join(PROVIDERS)}
""", formatter_class=argparse.RawDescriptionHelpFormatter, allow_abbrev=False)

PARSER.add_argument("--onnx", required=True, help="path to onnx file")
PARSER.add_argument("--json", help="path to json config file, default to the same folder as onnx file")
PARSER.add_argument("--host", default="localhost", help="host to bind the server to (default: localhost)")
PARSER.add_argument("--port", type=int, default=5000, help="port to bind the server to (default: 5000)")
PARSER.add_argument("--allow-cors", action="store_true", help="allow CORS (Cross-Origin Resource Sharing) - required by some programs to work")
ARGS: t.Final = PARSER.parse_args()

###############################################################################

if ARGS.json is None:
	JSON_PATH: t.Final = ARGS.onnx + ".json"
else:
	JSON_PATH: t.Final = ARGS.json
with open(JSON_PATH, mode="r", encoding="utf-8") as f:
	PIPER_CONFIG: t.Final = PiperConfig.from_dict(json.load(f))
with open(ARGS.onnx, mode="rb") as f: # save to memory to avoid re-load from disk every time
	ONNX_FILE: t.Final = f.read()

PIPER_SYN_CONFIG: t.Final = SynthesisConfig(noise_scale=2/3, noise_w_scale=.8, length_scale=1., speaker_id=None)
PIPER_STR: t.Final = "piper"
NORMALIZER: t.Final = VietnameseNormalizer()
TRANS_TABLE: t.Final = str.maketrans("", "", "~#+")


def stream_audio_generator(text: str) -> bytes:
	text = NORMALIZER.normalize(text.translate(TRANS_TABLE))

	# because onnxruntime python doesn’t have mecanism to free up memory, must delete session and re-create every time
	session = ort.InferenceSession(ONNX_FILE, providers=PROVIDERS)
	piper = PiperVoice(config=PIPER_CONFIG, session=session)
	# custom onnxruntime provider, see: https://github.com/OHF-Voice/piper1-gpl/blob/main/src/piper/voice.py

	buffer = BytesIO()
	with wave.open(buffer, mode="wb") as wav_file:
		piper.synthesize_wav(text, wav_file, syn_config=PIPER_SYN_CONFIG)
	del session, piper
	gc.collect()

	buffer.seek(0)
	return buffer.getvalue()


@t.final
class OpenAISpeechRequest(BaseModel):
	model: str = Field(default=PIPER_STR, frozen=True, description="PiperTTS, other models have no effect")
	input: str = Field(..., description="The text to synthesize, or list of text segments.")
	voice: str = Field(default=ARGS.onnx, frozen=True, description=ARGS.onnx + ", other voices have no effect")
	response_format: str = Field(default="wav", frozen=True, description="WAV audio format, other formats have no effect")

###############################################################################

APP: t.Final = FastAPI(title="Piper OpenAI TTS", description="An OpenAI-compatible /v1/audio/speech API wrapper for Piper.")

if ARGS.allow_cors:
	from fastapi.middleware.cors import CORSMiddleware
	APP.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])


@APP.get("/v1/models")
async def list_models() -> dict:
	return {"object": "list", "data": [{"id": PIPER_STR, "object": "model", "created": 1782988130, "owned_by": "myself"}]}


@APP.get("/v1/audio/voices")
async def list_voices(model: t.Annotated[str, Query()] = PIPER_STR) -> dict:
	return {"voices": [ARGS.onnx]}


@APP.post("/v1/audio/speech")
def generate_speech(request: OpenAISpeechRequest) -> Response:
	text = request.input if request.input != "" else "lỗi không có văn bản"
	return Response(stream_audio_generator(text), media_type="audio/wav")


if __name__ == "__main__":
	import uvicorn
	uvicorn.run(APP, host=ARGS.host, port=ARGS.port)
