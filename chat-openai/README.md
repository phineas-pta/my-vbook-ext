# sơ lược về chạy local trên pc

lấy ip của pc trong mạng wifi nội bộ: `arp -a`<br />
(trên linux/mac có thể cần phải cài thêm kiểu ví dụ `apt-get install net-tools`)

## dân nhà giàu có gpu chạy local LLM

dễ setup nhất và tương thích phần cứng tốt nhất là định dạng GGUF

kiếm file gguf trên https://huggingface.co/ 👉 kiếm file quant Q4-Q5-Q6-Q7-Q8 tuỳ cấu hình (dưới Q4 model sẽ ngu đi trừ phi model siêu khủng)

*ghi chú*: Gemma 4 hay bị lỗi với tools calling do chat template có format hơi dị, nên ưu tiên dùng Qwen 3.x

trình chạy file gguf:
- llama.cpp: hơi khó dùng cho tay mơ, độ tinh chỉnh cao để đạt tốc độ tốt nhất
  - link tải: https://github.com/ggml-org/llama.cpp/releases/latest
  - docs: https://github.com/ggml-org/llama.cpp/blob/master/tools/server/README.md
- các phái sinh của llama.cpp (dễ dùng hơn):
  - Jan (dev Việt): https://www.jan.ai/
  - LM Studio (khuyên dùng cái này thay vì Ollama): https://lmstudio.ai/download
  - OpenWebUI: https://openwebui.com/
  - AnythingLLM: https://anythingllm.com/download
  - Cherry Studio (dev tàu): https://cherryai.com/download

nếu card nvidia đời mới + dân coder python:
- TabbyAPI: định dạng ExLlamaV3
- vLLM và SGLang: định dạng FP4 và FP8

## dân xài chùa chơi reverse proxy:

1. có acc google antigravity / claude code / openai codex / xai grok

link tải: https://github.com/router-for-me/CLIProxyAPI/releases/latest

tạo file `config.yaml`:

```yaml
config-version: 8

server:
  host: "0.0.0.0"
  port: 11434

management:
  allow-remote: false
  secret-key: "███"
# đặt mật khẩu vào đây, nhớ lưu lại đâu đó vì file này sẽ auto giấu password
```

login acc (làm 1 lần duy nhất)
- google antigravity: chạy lệnh `cli-proxy-api.exe -antigravity-login`
- claude code: chạy lệnh `cli-proxy-api.exe -claude-login`
- openai codex: chạy lệnh `cli-proxy-api.exe -codex-login`
- xai grok: chạy lệnh `cli-proxy-api.exe -xai-login`

sau đó chạy `cli-proxy-api.exe` là dc

vào `http://localhost:11434/management.html` để xem quota, mật khẩu là cái đã nhập ở trong file `config.yaml`

2. câu api từ gemini web

phải bik python với lại gemini web phế vật vkl nên tốt nhất đừng chơi

https://github.com/Nativu5/Gemini-FastAPI
