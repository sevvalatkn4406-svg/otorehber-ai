# OtoRehber AI

Araç araştırma, karşılaştırma ve bakım planlamasına yardımcı olan yapay zekâ destekli bir öğrenci projesi.

## Amaç ve hedef kullanıcılar

Proje; ilk kez araç alacakların, aile aracı arayanların, performans meraklılarının ve mevcut araç sahiplerinin seçenekleri incelemesine ve temel bakım adımlarını planlamasına yardımcı olur.

## Özellikler

- Marka/model araması ve marka, kasa tipi, yakıt, vites ve fiyat aralığı filtreleri
- Fiyat, motor gücü ve tüketim ölçütlerine göre sıralama
- Araçları garaja ekleme ve en fazla üç aracı karşılaştırma
- Bütçe, kullanım ve önceliklere göre AI destekli araç önerileri
- Araç yaşı ve kilometreye göre bakım planı
- Gemini API kullanılamadığında yerel kural tabanlı öneri ve bakım planı
- Mobil uyumlu menü, katalog ve karşılaştırma görünümü

## Yapay zekâ geliştirme araçları

İlk sürüm Google Antigravity ile geliştirildi. Ücretsiz kullanım kotası dolduktan sonra iyileştirmeler OpenAI Codex CLI ile sürdürüldü. Her iki araçta da değişiklikler adım adım, kapsamı belirli promptlarla istendi. Kod değişikliklerinin ardından yerel lint/build doğrulaması yapıldı; bu kontrollerde bulunan hatalar düzeltilip yeniden doğrulandı.

## Teknolojiler

- Next.js 16 (App Router ve Route Handlers)
- React 19
- TypeScript
- Tailwind CSS v4
- Gemini API
- Git ve GitHub
- Vercel

## Yerel geliştirme

Node.js ve npm kurulu olmalıdır.

```bash
npm install
```

Ortam dosyası örneğini kopyalayın ve gerekiyorsa değerleri kendi geliştirme ortamınızda tanımlayın:

```powershell
Copy-Item .env.example .env.local
```

Geliştirme sunucusunu başlatın:

```bash
npm run dev
```

Uygulamayı [http://localhost:3000](http://localhost:3000) adresinde açın.

## Ortam değişkenleri

| Değişken | Açıklama | Değer |
|---|---|---|
| `GEMINI_API_KEY` | Sunucu tarafındaki Gemini API anahtarı | Tanımlanmadı |
| `GEMINI_MODEL` | GenerateContent destekleyen Gemini model adı; boş bırakılırsa varsayılan model kullanılır | Tanımlanmadı |

API anahtarı sunucu tarafında kullanılır; istemciye gönderilmez ve loglara yazılmaz.

## AI çalışma biçimi

Araç önerileri ve bakım planları için Gemini API entegrasyonu kullanılır. API anahtarı yoksa, istek zaman aşımına uğrarsa veya Gemini API hata verirse uygulama otomatik olarak yerel kural tabanlı öneri motoruna geçer. Yanıtta kullanılan kaynak ve varsa fallback nedeni belirtilir.

## Veri ve AI uyarısı

Araç özellikleri, fiyat aralıkları, maliyetler ve güvenlik puanları örnek veya tahmini verilerdir; resmi üretici, bayi ya da Euro NCAP verisi değildir. AI yanıtları bilgilendirme amaçlıdır. Satın alma ve bakım kararlarından önce üretici bilgilerini ve yetkili servis önerilerini ayrıca kontrol edin.

## Production

[https://otorehber-ai.vercel.app](https://otorehber-ai.vercel.app)

## Deployment ve güncelleme döngüsü

Projenin dağıtım ve güncelleme adımları [.agents/skills/vercel-web-deployment/SKILL.md](.agents/skills/vercel-web-deployment/SKILL.md) içinde belgelenmiştir. Her değişiklikte yerel lint ve build kontrollerini çalıştırın, diff'i inceleyin ve GitHub/Vercel yayın adımlarını bu kılavuzdaki kurallara göre yürütün. Kullanıcı onayı olmadan `git push` yapılmaz.

## Geliştirme commit kapsamları

1. Çoklu filtreler, fiyat kaydırıcısı ve anlık arama
2. AI zaman aşımı, hata yönetimi ve yerel fallback
3. Mobil menü ve mobil karşılaştırma görünümü
