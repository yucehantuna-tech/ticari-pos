# Benim Yapay Zekam — Stoksuz E-Ticaret Yetki ve Araştırma Mimarisi

## Hedef
AI iş ortağı; ürün, tedarikçi, fiyat, stok, kargo, komisyon, rakip, satış kanalı ve müşteri süreçlerini tek merkezden araştırabilmeli ve kullanıcının bağladığı hesaplarda izin verilen işlemleri gerçekleştirebilmelidir.

## Yetki modeli
- READ: araştırma, fiyat/stok kontrolü, raporlama
- PREPARE: ürün başlığı/açıklaması/görsel metni, fiyat ve ilan taslağı
- PUBLISH: satış ilanını yayınlama
- ORDER: tedarikçiden sipariş oluşturma
- MESSAGE: müşteri mesajı gönderme
- MONEY: ödeme/para transferi gibi finansal işlemler

PUBLISH, ORDER, MESSAGE ve MONEY varsayılan olarak kullanıcı onayı ister. Kullanıcı hesap bazında açık yetki verebilir; her işlem audit log'a yazılır.

## Araştırma motoru
AI aşağıdaki sinyalleri birlikte değerlendirecek:
1. Tedarikçi fiyatı ve stok durumu
2. Satış kanalındaki rakip fiyatlar
3. Platform komisyonu
4. Kargo/teslimat maliyeti
5. İade/iptal riski
6. Tahmini brüt ve net marj
7. Ürün ağırlığı/hacmi ve operasyon zorluğu
8. Marka/telif/uyumluluk riskleri
9. Tedarikçinin gönderici adı ve dropshipping şartları
10. Fatura ve satış sonrası süreç
11. Minimum sipariş, varyant ve stok senkronizasyonu
12. Satış kanalının API ve sözleşme kuralları

## Entegrasyon prensibi
Her pazar yeri, tedarikçi veya hizmet için resmi API/entegrasyon varsa onu kullan. Kullanıcı hesabı OAuth/API anahtarı ile bağlanır. Gizli anahtarlar istemci koduna veya GitHub'a yazılmaz.

## İş akışı
Araştır -> filtrele -> kârı hesapla -> kullanıcıya öner -> taslak oluştur -> kullanıcı onayı -> yayınla/sipariş ver -> takip et -> sonuçları öğren.

## Gerçekçilik
AI satış veya kâr garantisi vermez. Tedarikçi stoğu, fiyatı ve platform kuralları değişebileceği için işlem öncesi son kontrol yapılır.
