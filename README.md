# các extensions cá nhân dùng cho app đọc sách vBook

hướng dẫn viết extensions:
- https://github.com/Darkrai9x/vbook-extensions/blob/master/extension-api.md
- https://github.com/dat-bi/ext-vbook/tree/main/vbook-tool/context

## nghe đọc truyện (TTS) = OpenAI-compatible API endpoints

icon copy từ https://github.com/Read-Aloud/read-aloud/blob/master/img/icon.png

có thể chạy local trên pc (ko cần gpu) trong cùng mạng wifi nội bộ: chạy tts trên pc, phát audio trên đt, ko sợ đt nóng máy + hao pin

chọn 1 trong các model sau để tải về:
- VieNeu TTS: nhanh + nhẹ + có clone voice<br />
https://huggingface.co/pnnbao-ump/VieNeu-TTS-v3-Turbo/blob/main/gguf/vieneu-v3-turbo-q8_0.gguf
- OmniVoice: nặng hơn + có clone voice<br />
https://huggingface.co/doof-ferb/KhanhTTS-OmniVoice-GGUF/blob/main/KhanhTTS-OmniVoice-q8_0.gguf
- Piper: ko có clone voice, mỗi model là 1 giọng riêng<br />
https://huggingface.co/doof-ferb/nghitts-copy/tree/main/gguf

chuẩn bị file audio để clone nếu muốn

tạo file `config.json`, ví dụ pc có gpu sử dụng OmniVoice để clone voice Nguyễn Ngọc Ngạn:
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
			"voice_presets": {
				"ngocngan3701": {
					"voice_ref": "rZnygcVV3vI.wav",
					"reference_text": "Kính thưa quý vị, từ bao nhiêu năm qua, tất cả các băng đọc truyện của Nguyễn Ngọc Ngạn do trung tâm Thuý Nga thực hiện, đã bị những người lạ đưa lên bừa bãi trên mạng."
				}
			},
			"default_voice_preset": "ngocngan3701"
		}
	]
```

tải `audio.cpp` về từ: https://github.com/0xShug0/audio.cpp/releases/latest

khởi chạy: `audiocpp_server --config config.json`

lấy ip của pc trong mạng wifi nội bộ: `arp -a`<br />
(trên linux/mac có thể cần phải cài thêm kiểu ví dụ `apt-get install net-tools`)
