# Canlıya alma

Bu proje tek container olarak çalışacak şekilde hazırlanmıştır.

Gerekli ortam değişkenleri:
- OPENAI_API_KEY
- OPENAI_MODEL
- PORT=8787

API anahtarını GitHub'a koyma.

Hosting tarafında Dockerfile ile deploy et ve ortam değişkenlerini hosting sağlayıcısının Secret/Environment bölümünden tanımla.

Canlı URL oluştuğunda frontend'in /api/chat ve /api/research istekleri aynı alan adına göre çalışacak şekilde yönlendirilmelidir.
