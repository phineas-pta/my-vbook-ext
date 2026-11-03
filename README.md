# 1 số extensions cá nhân dùng cho app đọc sách vBook

hướng dẫn viết extensions:
- https://github.com/Darkrai9x/vbook-extensions/blob/master/extension-api.md
- https://github.com/dat-bi/ext-vbook/tree/main/vbook-tool/context

## nghe đọc truyện (TTS) = OpenAI-compatible API endpoints

icon copy từ https://github.com/Read-Aloud/read-aloud/blob/master/img/icon.png

có thể dùng với OpenAI bình thường

ng dùng cần phải nhập 3 settings:
- API endpoint URL (phải kết thúc với đuôi 'v1')
- API key
- TTS model

👉👉👉 [hướng dẫn setup chạy local trên pc](tts-openai/README.md) 👈👈👈

## chat = OpenAI-compatible API endpoints

icon copy từ https://github.com/ggml-org/llama.cpp/blob/master/media/llama1-icon.svg

hàng gốc: https://github.com/Darkrai9x/vbook-extensions/tree/master/chatgpt-ai

extension này cho phép sử dụng các endpoints khác, ví dụ:
- dân chạy local LLM:
  - llama.cpp và các phái sinh (khuyên dùng LM Studio thay vì Ollama): định dạng GGUF
  - TabbyAPI: định dạng ExLlamaV3
  - vLLM và SGLang: định dạng FP4 và FP8
- dân xài chùa chơi reverse proxy:
  - https://github.com/router-for-me/CLIProxyAPI
  - https://github.com/Nativu5/Gemini-FastAPI

ng dùng cần phải nhập 3 settings:
- API endpoint URL (phải kết thúc với đuôi 'v1')
- API key
- TTS model
