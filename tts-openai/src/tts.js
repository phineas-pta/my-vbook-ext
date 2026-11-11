/**
 * voice synthesis
 * @see https://developers.openai.com/api/reference/resources/audio/subresources/speech/methods/create
 * @param {string} text
 * @param {string} voiceId
 * @returns {string} base64-encoded wav
 */
function execute(text, voiceId) {
	let req_body = {
		model: OPENAI_API_MODEL,
		voice: voiceId,
		response_format: "wav",
		input: text
	};
	const audiocpp_options = get_audiocpp_options();
	if (Object.keys(audiocpp_options).length > 0) req_body.options = audiocpp_options;

	let res = fetch(OPENAI_API_URL + "/audio/speech", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"Authorization": "Bearer " + OPENAI_API_KEY
		},
		body: JSON.stringify(req_body),
		timeout: 300000,
	});

	if (!res.ok) {
		return Response.error("error in tts.js: HTTP " + res.status);
	} else {
		return Response.success(res.base64());
	}
}

/**
 * get options specific to audio.cpp
 * @returns {object[]}
 */
function get_audiocpp_options() {
	let res = {};
	for (let i of ["temperature", "top_p", "repetition_penalty", "guidance_scale"]) {
		if (localConfig.getItem(i, "-1") !== "-1") {
			let tmp = parseFloat(localConfig.getItem(i));
			if (!isNaN(tmp) && isFinite(tmp) && tmp > 0) {
				res[i] = tmp;
			}
		}
	}
	for (let i of ["top_k", "max_tokens", "text_chunk_size", "num_inference_steps"]) {
		if (localConfig.getItem(i, "-1") !== "-1") {
			let tmp = parseInt(localConfig.getItem(i));
			if (!isNaN(tmp) && isFinite(tmp) && tmp > 0) {
				res[i] = tmp;
			}
		}
	}
	for (let i of ["text_chunk_mode", "instruct"]) {
		if (localConfig.getItem(i, "NULL") !== "NULL") {
			res[i] = localConfig.getItem(i);
		}
	}
	return res;
}
