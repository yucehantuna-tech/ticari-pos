# Bağlanacak servisler

AI iş ortağına servis eklemek için her sağlayıcı şu standart yetenekleri mümkün olduğunca sunar:

## Tedarikçi
catalog.read, price.read, stock.read, order.create, order.status

## Pazaryeri
listing.create, listing.update, listing.status, order.status, analytics.read

## Kargo
shipping.quote, tracking.read

## Müşteri iletişimi
message.read, message.send

## Ödeme
Ödeme/para transferi yetkileri ayrı tutulur ve varsayılan olarak kapalıdır.

## Bağlantı yöntemi
1. Resmi API varsa API/OAuth.
2. API yoksa otomasyon ancak hizmetin şartları izin veriyorsa.
3. Kullanıcı adı/şifreyi kodda veya GitHub'da tutma.
4. Tokenları sunucu tarafında şifreli sakla.
5. Her kritik işlemden önce izin kontrolü ve gerekiyorsa kullanıcı onayı yap.
6. İşlem sonucunu audit log'a yaz.

## İlk entegrasyon sırası
Tedarikçi katalogları -> ürün araştırma -> pazaryeri ürün taslağı -> yayınlama -> sipariş -> kargo takip -> müşteri mesajları -> analitik.
