# AI Ortak API

POS uygulamasından bağımsız backend katmanı.

## Güvenlik
Gerçek API anahtarları GitHub'a konmaz. Sunucu ortam değişkenleri kullanılır.

## Uçlar
- GET /api/health
- POST /api/chat
- POST /api/research

## Çalıştırma
`cd ai-ortak/server && npm start`

`OPENAI_MODEL` sunucu ortamında açıkça belirtilmelidir.
