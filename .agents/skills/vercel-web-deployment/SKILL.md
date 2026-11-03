---
name: vercel-web-deployment
description: OtoRehber AI (Next.js) projesini Git ve GitHub ile sürümleyip GitHub'a bağlı Vercel projesi üzerinden production ortamına almak ve her değişikliği güvenli bir güncelleme döngüsüyle canlıya taşımak için kullanılır.
---

# Vercel Web Deployment Skill

Bu skill, OtoRehber AI projesindeki bir değişikliğin local bilgisayardan başlayarak
**Git commit → GitHub push → Vercel production deployment → canlı doğrulama**
aşamalarından geçmesini standart hâle getirir. AI coding agent bu dosyayı okuyarak
deployment işlerini her seferinde aynı, güvenli sırayla yapar.

## Ne zaman kullanılır?

- Projeyi ilk kez GitHub'a yüklemek ve Vercel'e bağlamak gerektiğinde
- Yapılan bir geliştirmeyi canlı siteye taşımak gerektiğinde
- Ortam değişkeni (environment variable) eklemek veya değiştirmek gerektiğinde
- Deployment başarısız olduğunda sorunu teşhis etmek gerektiğinde

## Proje varsayımları

| Konu | Değer |
|---|---|
| Proje | OtoRehber AI – Akıllı Araç Keşif, Karşılaştırma ve Bakım Asistanı |
| Framework | Next.js (App Router), React, TypeScript, Tailwind CSS |
| Paket yöneticisi | npm |
| Ana dal (branch) | `main` |
| Uzak depo | GitHub (`origin`) |
| Hosting | Vercel, GitHub entegrasyonu ile (her `main` push'u production deployment başlatır) |
| AI modülü | `src/app/api/ai/route.ts` (sunucu tarafı), Gemini API + kural tabanlı yedek sistem |
| Gizli bilgiler | Local'de `.env.local`, production'da Vercel Environment Variables |
| Terminal | Windows PowerShell (komutlar macOS/Linux terminalinde de aynıdır) |

## Agent için kesin kurallar

1. Kullanıcı açıkça onay vermeden `git push` çalıştırma.
2. `git push --force`, `git reset --hard`, `git clean -fd` gibi geri alınamaz
   komutları asla çalıştırma.
3. `.env`, `.env.local` veya API anahtarı içeren hiçbir dosyayı commit'leme.
   Commit öncesi `git status` çıktısında bu dosyalar görünürse dur ve kullanıcıyı uyar.
4. API anahtarlarını koda, README'ye, commit mesajına veya terminal çıktısına yazma.
5. Sunucu tarafında kullanılan gizli değişkenlere `NEXT_PUBLIC_` öneki verme
   (bu önek değişkeni tarayıcıya açar ve herkes görebilir).
6. `npm run build` başarısızsa commit/push yapma; önce hatayı açıkla ve düzelt.
7. Her commit tek ve anlamlı bir değişikliği temsil etmeli.
8. Doğrulamadığın bir sonucu "test edildi" diye raporlama.
9. Sitede gerçek olmayan referans, kullanıcı yorumu, kurum/marka logosu veya
   başarı iddiası kullanma. Araç verileri örnek veridir ve sitede bu belirtilir.

## Bölüm A — İlk kurulum (bir kez yapılır)

### A1. Ön kontrol

```powershell
node -v
npm -v
git --version
gh --version
gh auth status
```

Hepsi sürüm bilgisi vermeli. `gh auth status` GitHub hesabını göstermiyorsa
önce `gh auth login` çalıştırılır (GitHub.com → HTTPS → tarayıcı ile giriş).

### A2. Local doğrulama

```powershell
npm install
npm run lint
npm run build
npm run dev
```

`npm run dev` sonrası http://localhost:3000 açılır ve sayfalar kontrol edilir.
`npm run build` hatasız bitmeden GitHub'a yükleme yapılmaz.

### A3. Git deposu, GitHub repository ve ilk push

```powershell
git init -b main
git status
git add .
git commit -m "feat: OtoRehber AI ilk çalışan sürüm"
gh repo create otorehber-ai --private --source=. --remote=origin --push
```

- Public repository için `--private` yerine `--public` kullanılır.
- Private repository'de ders sorumlusuna erişim verilir:
  GitHub → Repository → Settings → Collaborators → Add people.
- Kontrol: `git remote -v` komutu `origin` adresini göstermeli,
  `gh repo view --web` repository'yi tarayıcıda açmalı.

### A4. Vercel'e bağlama

1. vercel.com → **Continue with GitHub** ile giriş.
2. Add New → Project → `otorehber-ai` repository'sini seç → Import.
   (Repository listede yoksa: "Adjust GitHub App Permissions" ile erişim ver.)
3. Framework Preset: **Next.js** (otomatik algılanır). Build ayarları varsayılan kalır.
4. Environment Variables bölümüne gerekli değişkenler eklenir (Bölüm C).
5. Deploy → işlem bitince verilen `https://<proje>.vercel.app` adresi production URL'dir.
6. Production URL README.md dosyasına yazılır ve ayrı bir commit ile gönderilir.

## Bölüm B — Zorunlu güncelleme döngüsü (her değişiklikte)

1. **Değişikliği tarif et:** AI coding agent'a tek ve net bir görev ver.
2. **Local kontrol:** `npm run dev` ile siteyi aç; değişikliği tarayıcının
   geliştirici araçlarında (F12 → cihaz görünümü) 360, 375, 390, 768 ve 1280 px
   genişliklerde kontrol et. Yatay kayma veya taşan metin olmamalı.
3. **Farkları incele:**
   ```powershell
   git status
   git diff
   ```
   Beklenmeyen dosya değişikliği varsa nedenini anlamadan devam etme.
4. **Derleme ve kalite kontrolü:**
   ```powershell
   npm run lint
   npm run build
   ```
5. **Commit ve push:**
   ```powershell
   git add .
   git commit -m "<tür>: <kısa açıklama>"
   git push
   ```
6. **Vercel otomatik deployment:** `main` dalına yapılan her push production
   deployment başlatır. Vercel panelinde Deployments sekmesinden durum izlenir
   (Building → Ready). Deployment satırındaki commit mesajı, gönderilen commit ile aynı olmalı.
7. **Canlı doğrulama:** Production URL'yi aç, sayfayı yenile (Ctrl + Shift + R),
   değişikliğin canlıda göründüğünü masaüstü ve mobil genişlikte doğrula.

### Commit mesajı biçimi

| Tür | Kullanım | Örnek |
|---|---|---|
| `feat` | Yeni özellik | `feat: araç keşif paneline fiyat aralığı kaydırıcısı ekle` |
| `fix` | Hata düzeltme | `fix: mobilde taşan karşılaştırma tablosunu düzelt` |
| `style` | Görsel düzenleme | `style: koyu tema renklerini iyileştir` |
| `docs` | Dokümantasyon | `docs: README'ye production URL ekle` |
| `refactor` | Davranışı değiştirmeyen kod düzenleme | `refactor: öneri puanlamasını ayrı dosyaya taşı` |

## Bölüm C — Ortam değişkenleri (environment variables)

| Değişken | Nerede kullanılır | Zorunlu mu? |
|---|---|---|
| `GEMINI_API_KEY` | Sadece sunucu tarafı API route (`src/app/api/ai/route.ts`) | Hayır (yoksa kural tabanlı sistem çalışır) |
| `GEMINI_MODEL` | Sadece sunucu tarafı API route | Hayır (varsayılan model kullanılır) |

- **Local:** Proje kökünde `.env.local` dosyası oluşturulur:
  ```
  GEMINI_API_KEY=buraya_kendi_anahtarin
  ```
  Bu dosya `.gitignore` içindeki `.env*` kuralı sayesinde GitHub'a gitmez.
  Paylaşılabilir şablon olarak yalnızca değer içermeyen `.env.example` commit'lenir.
- **Production:** Vercel → Project → Settings → Environment Variables →
  değişken eklenir → Production (ve istenirse Preview) seçilir → Save.
- Değişken ekledikten veya değiştirdikten sonra yeni bir deployment gerekir:
  Deployments → son deployment → ⋯ → **Redeploy**.
- Anahtar yanlışlıkla GitHub'a gittiyse: Google AI Studio'da anahtarı hemen
  iptal et (sil), yeni anahtar oluştur, Vercel'deki değeri güncelle.

## Bölüm D — Sorun giderme

| Belirti | Olası neden | Çözüm |
|---|---|---|
| Vercel build "Failed" | Local'de build edilmemiş hata | Vercel build loglarını oku, local'de `npm run build` çalıştır, hatayı düzelt, tekrar push et |
| Push sonrası canlı site değişmedi | Deployment hâlâ sürüyor veya tarayıcı önbelleği | Vercel Deployments sekmesini kontrol et, Ctrl + Shift + R |
| `rejected ... fetch first` | GitHub'da local'de olmayan commit var | `git pull --rebase` sonra `git push` |
| AI asistanı canlıda yalnızca yerel öneri veriyor | Vercel'de `GEMINI_API_KEY` eksik veya Redeploy yapılmadı | Bölüm C'deki adımları uygula ve Redeploy yap |
| `.env.local` git status'ta görünüyor | `.gitignore` eksik veya hatalı | `.gitignore` dosyasına `.env*` ekle, dosyayı commit'leme |
| `gh: command not found` | GitHub CLI kurulu değil | https://cli.github.com adresinden kur, terminali yeniden aç |

## Teslim kontrol listesi

- [ ] Production URL HTTPS ile açılıyor
- [ ] GitHub repository erişilebilir (private ise ders sorumlusuna erişim verildi)
- [ ] Bu dosya `.agents/skills/vercel-web-deployment/SKILL.md` konumunda ve commit'lenmiş
- [ ] README: amaç, hedef kullanıcı, kullanılan AI coding agent, teknolojiler, local çalıştırma, production URL
- [ ] İlk sürümden sonra en az 3 anlamlı geliştirme commit'i var
- [ ] Her geliştirme commit'inden sonra canlı site güncellendi ve doğrulandı
- [ ] `.env.local` ve API anahtarı Git geçmişinde yok (`git log --all -- .env.local` boş dönmeli)