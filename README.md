![](https://img.shields.io/badge/vbook-extensions-3166B0?style=for-the-badge&logo=readme&logoColor=white)
![](https://img.shields.io/badge/hosted%20by-localhost-brightgreen?style=for-the-badge&logo=serverless)

# 1 số extensions cá nhân dùng cho app đọc sách vBook

hướng dẫn viết extensions:
- https://github.com/Darkrai9x/vbook-extensions/blob/master/extension-api.md
- https://github.com/dat-bi/ext-vbook/tree/main/vbook-tool/context

## nghe đọc truyện (TTS) = OpenAI-compatible API endpoints

icon copy từ https://github.com/Read-Aloud/read-aloud/blob/master/img/icon.png

có thể dùng với OpenAI bình thường hoặc các endpoints selfhost

ng dùng cần phải nhập 3 settings:
- API endpoint URL (phải kết thúc với đuôi 'v1')
- API key
- TTS model

👉👉👉 [hướng dẫn setup chạy local trên pc](tts-openai/README.md) 👈👈👈

## chat = OpenAI-compatible API endpoints

icon copy từ https://github.com/ggml-org/llama.cpp/blob/master/media/llama1-icon.svg

hàng gốc: https://github.com/Darkrai9x/vbook-extensions/tree/master/chatgpt-ai 👈 chỉ dùng dc với OpenAI

extension này dùng dc với OpenAI bình thường hoặc các endpoints selfhost

ng dùng cần phải nhập 3 settings:
- API endpoint URL (phải kết thúc với đuôi 'v1')
- API key
- TTS model

👉👉👉 [hướng dẫn setup chạy local trên pc](chat-openai/README.md) 👈👈👈

dịch = OpenAI-compatible API endpoints: 👉 https://github.com/Moleys/vbook-ext/tree/main/openai-compatible
