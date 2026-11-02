# hướng dẫn setup chạy local trên pc

có thể chạy local trên pc (ko cần gpu) trong cùng mạng wifi nội bộ: chạy tts trên pc, phát audio trên đt, ko sợ đt nóng máy + hao pin

tải `audio.cpp` về từ: https://github.com/0xShug0/audio.cpp/releases/latest

chuẩn bị model và khởi tạo file `config.json`:

<details name="matching-name">

<summary>VieNeu TTS: nhanh + nhẹ + nhiều giọng (có tính năng clone voice nhưng setup hơi phức tạp)</summary>

tải file gguf: https://huggingface.co/pnnbao-ump/VieNeu-TTS-v3-Turbo/blob/main/gguf/vieneu-v3-turbo-q8_0.gguf

tải thêm folder [`vieneu_voices`](vieneu_voices.zip) (nguồn: lấy từ cùng repo huggingface ở trên)

tải thêm `sea-g2p`:
- link: https://github.com/pnnbao97/sea-g2p/releases/latest
- file `sea_g2p.bin`
- file library: `dll` cho windows, `dylib` cho mac, `so` cho linux

ví dụ pc ko có gpu

```json
{
	"host": "0.0.0.0",
	"port": 5000,
	"max_loaded_models": 1,
	"cors_origins": "*",
	"models": [
		{
			"id": "vieneu",
			"family": "vieneu_v3_turbo",
			"path": "vieneu-v3-turbo-q8_0.gguf",
			"task": "tts",
			"default_voice_preset": "minh_quan_pro",
			"voice_presets": {
				"adam": {
					"options": {
						"reference_codes_file": "vieneu_voices/adam/ref_codes.txt",
						"speaker_embedding_file": "vieneu_voices/adam/speaker.emb.txt"
					}
				},
				"adam_bua": {
					"options": {
						"reference_codes_file": "vieneu_voices/adam_bua/ref_codes.txt",
						"speaker_embedding_file": "vieneu_voices/adam_bua/speaker.emb.txt"
					}
				},
				"anh_khoi": {
					"options": {
						"reference_codes_file": "vieneu_voices/anh_khoi/ref_codes.txt",
						"speaker_embedding_file": "vieneu_voices/anh_khoi/speaker.emb.txt"
					}
				},
				"doan_trang": {
					"options": {
						"reference_codes_file": "vieneu_voices/doan_trang/ref_codes.txt",
						"speaker_embedding_file": "vieneu_voices/doan_trang/speaker.emb.txt"
					}
				},
				"duc_tri": {
					"options": {
						"reference_codes_file": "vieneu_voices/duc_tri/ref_codes.txt",
						"speaker_embedding_file": "vieneu_voices/duc_tri/speaker.emb.txt"
					}
				},
				"kim_thanh": {
					"options": {
						"reference_codes_file": "vieneu_voices/kim_thanh/ref_codes.txt",
						"speaker_embedding_file": "vieneu_voices/kim_thanh/speaker.emb.txt"
					}
				},
				"mai_anh": {
					"options": {
						"reference_codes_file": "vieneu_voices/mai_anh/ref_codes.txt",
						"speaker_embedding_file": "vieneu_voices/mai_anh/speaker.emb.txt"
					}
				},
				"manh_dung": {
					"options": {
						"reference_codes_file": "vieneu_voices/manh_dung/ref_codes.txt",
						"speaker_embedding_file": "vieneu_voices/manh_dung/speaker.emb.txt"
					}
				},
				"minh_duc": {
					"options": {
						"reference_codes_file": "vieneu_voices/minh_duc/ref_codes.txt",
						"speaker_embedding_file": "vieneu_voices/minh_duc/speaker.emb.txt"
					}
				},
				"minh_quan_pro": {
					"options": {
						"reference_codes_file": "vieneu_voices/minh_quan_pro/ref_codes.txt",
						"speaker_embedding_file": "vieneu_voices/minh_quan_pro/speaker.emb.txt"
					}
				},
				"minh_triet": {
					"options": {
						"reference_codes_file": "vieneu_voices/minh_triet/ref_codes.txt",
						"speaker_embedding_file": "vieneu_voices/minh_triet/speaker.emb.txt"
					}
				},
				"my_duyen": {
					"options": {
						"reference_codes_file": "vieneu_voices/my_duyen/ref_codes.txt",
						"speaker_embedding_file": "vieneu_voices/my_duyen/speaker.emb.txt"
					}
				},
				"ngoc_huyen": {
					"options": {
						"reference_codes_file": "vieneu_voices/ngoc_huyen/ref_codes.txt",
						"speaker_embedding_file": "vieneu_voices/ngoc_huyen/speaker.emb.txt"
					}
				},
				"ngoc_linh": {
					"options": {
						"reference_codes_file": "vieneu_voices/ngoc_linh/ref_codes.txt",
						"speaker_embedding_file": "vieneu_voices/ngoc_linh/speaker.emb.txt"
					}
				},
				"ngoc_tran": {
					"options": {
						"reference_codes_file": "vieneu_voices/ngoc_tran/ref_codes.txt",
						"speaker_embedding_file": "vieneu_voices/ngoc_tran/speaker.emb.txt"
					}
				},
				"pham_tuyen": {
					"options": {
						"reference_codes_file": "vieneu_voices/pham_tuyen/ref_codes.txt",
						"speaker_embedding_file": "vieneu_voices/pham_tuyen/speaker.emb.txt"
					}
				},
				"quang_son": {
					"options": {
						"reference_codes_file": "vieneu_voices/quang_son/ref_codes.txt",
						"speaker_embedding_file": "vieneu_voices/quang_son/speaker.emb.txt"
					}
				},
				"quynh_anh": {
					"options": {
						"reference_codes_file": "vieneu_voices/quynh_anh/ref_codes.txt",
						"speaker_embedding_file": "vieneu_voices/quynh_anh/speaker.emb.txt"
					}
				},
				"thai_son": {
					"options": {
						"reference_codes_file": "vieneu_voices/thai_son/ref_codes.txt",
						"speaker_embedding_file": "vieneu_voices/thai_son/speaker.emb.txt"
					}
				},
				"thanh_binh": {
					"options": {
						"reference_codes_file": "vieneu_voices/thanh_binh/ref_codes.txt",
						"speaker_embedding_file": "vieneu_voices/thanh_binh/speaker.emb.txt"
					}
				},
				"thien_tam_duc": {
					"options": {
						"reference_codes_file": "vieneu_voices/thien_tam_duc/ref_codes.txt",
						"speaker_embedding_file": "vieneu_voices/thien_tam_duc/speaker.emb.txt"
					}
				},
				"thuc_doan": {
					"options": {
						"reference_codes_file": "vieneu_voices/thuc_doan/ref_codes.txt",
						"speaker_embedding_file": "vieneu_voices/thuc_doan/speaker.emb.txt"
					}
				},
				"thuy_dung": {
					"options": {
						"reference_codes_file": "vieneu_voices/thuy_dung/ref_codes.txt",
						"speaker_embedding_file": "vieneu_voices/thuy_dung/speaker.emb.txt"
					}
				},
				"truc_ly": {
					"options": {
						"reference_codes_file": "vieneu_voices/truc_ly/ref_codes.txt",
						"speaker_embedding_file": "vieneu_voices/truc_ly/speaker.emb.txt"
					}
				},
				"xuan_vinh": {
					"options": {
						"reference_codes_file": "vieneu_voices/xuan_vinh/ref_codes.txt",
						"speaker_embedding_file": "vieneu_voices/xuan_vinh/speaker.emb.txt"
					}
				}
			}
		}
	],
	"default_session_options": {
		"vieneu_v3_turbo.g2p_library": "sea_g2p_rs-windows-x86_64.dll",
		"vieneu_v3_turbo.g2p_dict_file": "sea_g2p.bin"
	}
}
```

để clone voice: cần biết sử dụng python: cài `pip install vieneu` rồi chạy:

```python
import numpy as np
from vieneu._v3_turbo_engine import VieNeuTTSv3Turbo
tts = VieNeuTTSv3Turbo()

spk, codes = tts.prepare_reference("rZnygcVV3vI.wav") # file audio cần clone voice
np.savetxt("speaker.emb.txt", spk, fmt="%.8f", newline=",", encoding="utf-8")
np.savetxt("ref_codes.txt", codes, fmt="%d", encoding="utf-8")
```

sửa file `config.json` thêm đường dẫn tới 2 file `speaker.emb.txt` và `ref_codes.txt`

</details>

<details name="matching-name">

<summary>OmniVoice: nặng hơn + có clone voice dễ setup hơn (lỗi ko đọc dc chữ số)</summary>

tải file gguf: https://huggingface.co/doof-ferb/KhanhTTS-OmniVoice-GGUF/blob/main/KhanhTTS-OmniVoice-q8_0.gguf

chuẩn bị file audio để clone voice

ví dụ pc có gpu nvidia clone voice Nguyễn Ngọc Ngạn

```json
{
	"host": "0.0.0.0",
	"port": 5000,
	"backend": "cuda",
	"max_loaded_models": 1,
	"cors_origins": "*",
	"models": [
		{
			"id": "omnivoice",
			"family": "omnivoice",
			"path": "KhanhTTS-OmniVoice-q8_0.gguf",
			"task": "tts",
			"default_voice_preset": "ngocngan3701",
			"voice_presets": {
				"ngocngan3701": {
					"voice_ref": "rZnygcVV3vI.wav",
					"reference_text": "Kính thưa quý vị, từ bao nhiêu năm qua, tất cả các băng đọc truyện của Nguyễn Ngọc Ngạn do trung tâm Thuý Nga thực hiện, đã bị những người lạ đưa lên bừa bãi trên mạng."
				}
			}
		}
	],
	"default_session_options": {
		"omnivoice.perf_mode": "flash_attention"
	}
}
```

</details>

<details name="matching-name">

<summary>Piper: nhẹ nhất nhưng ko có clone voice</summary>

**file gguf đang bị lỗi chưa dùng dc**

tải file gguf (mỗi model là 1 giọng riêng): https://huggingface.co/doof-ferb/nghitts-copy/tree/main/gguf

tải thêm `espeak-ng` về từ https://github.com/espeak-ng/espeak-ng

ví dụ pc ko có gpu chạy giọng Thanh Phương Viettel

```json
{
	"host": "0.0.0.0",
	"port": 5000,
	"max_loaded_models": 1,
	"cors_origins": "*",
	"models": [
		{
			"id": "piper",
			"family": "piper_tts",
			"path": "thanhphuong2-f32.gguf",
			"task": "tts"
		}
	],
	"default_session_options": {
		"piper_tts.espeak_library_path": "C:/Program Files/eSpeak NG/libespeak-ng.dll",
		"piper_tts.espeak_data_path": "C:/Program Files/eSpeak NG/espeak-ng-data"
	}
}
```

</details>

khởi chạy: `audiocpp_server.exe --config config.json`

lấy ip của pc trong mạng wifi nội bộ: `arp -a`<br />
(trên linux/mac có thể cần phải cài thêm kiểu ví dụ `apt-get install net-tools`)

trong vBook, phần cài đặt của extension:
- điền vào mục url theo dạng: `http://192.168.█.█:5000/v1`
- điền gì vào api key cũng dc
- điền tên model theo `id` trong file `config.json` ở trên
