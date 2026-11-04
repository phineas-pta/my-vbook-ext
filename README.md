![](https://img.shields.io/badge/vbook-extensions-black?style=for-the-badge&logo=readme&logoColor=white&labelColor=3166B0)
![](https://img.shields.io/badge/hosted%20by-localhost-brightgreen?style=for-the-badge&logo=serverless)

# 1 số extensions cá nhân dùng cho app đọc sách vBook

vào mục Releases để tải file zip về cài vBook

## nghe đọc truyện (TTS) = OpenAI-compatible API endpoints

có thể dùng với OpenAI bình thường hoặc các endpoints selfhost

ng dùng cần phải nhập 3 settings:
- API endpoint URL (thường sẽ kết thúc với đuôi 'v1')
- API key
- TTS model

👉👉👉 [hướng dẫn setup chạy local trên pc](tts-openai/README.md) 👈👈👈

## trợ lý (chatbot) = OpenAI-compatible API endpoints

hàng gốc: https://github.com/Darkrai9x/vbook-extensions/tree/master/chatgpt-ai 👈 chỉ dùng dc với OpenAI

extension này dùng dc với OpenAI bình thường hoặc các endpoints selfhost

ng dùng cần phải nhập 3 settings:
- API endpoint URL (thường sẽ kết thúc với đuôi 'v1')
- API key
- Assistant model

👉👉👉 [hướng dẫn setup chạy local trên pc](chat-openai/README.md) 👈👈👈

dịch = OpenAI-compatible API endpoints: 👉 https://github.com/Moleys/vbook-ext/tree/main/openai-compatible

# ghi chú + credits

hướng dẫn viết extensions + hàng mẫu:
- https://github.com/Darkrai9x/vbook-extensions/blob/master/extension-api.md
- https://github.com/dat-bi/ext-vbook/tree/main/vbook-tool/context

1 số OpenAI-compatible API endpoints
- OpenAI: `https://api.openai.com/v1`
- Claude: `https://api.anthropic.com/v1`
- Gemini: `https://generativelanguage.googleapis.com/v1beta/openai`
- Deepseek: `https://api.deepseek.com`
- Grok: `https://api.x.ai/v1`
- Qwen: `https://ap-southeast-1.maas.qwencloudapi.com/compatible-mode/v1`
- Muse: `https://api.meta.ai/v1`
- Mistral: `https://api.mistral.ai/v1`

nguồn icon copy từ:
- https://cdn.openai.com/brand/openai-logos.zip
- https://github.com/Read-Aloud/read-aloud/blob/master/img/icon.png
- https://github.com/ggml-org/llama.cpp/blob/master/media/llama1-icon.svg
