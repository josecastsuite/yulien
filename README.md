# Cloudflare Pages ile Deploy (EN KOLAY YOL)

## Yöntem 1: Sürükle Bırak (30 saniye)
1. https://dash.cloudflare.com > Pages > Create a project > Direct Upload
2. Yulien-Birthday-kenardan-az.html dosyasını sürükle bırak
3. Deploy de - sana https://yulien-birthday.pages.dev gibi link verecek
4. Bitti, sonsuza kadar orada

## Yöntem 2: Worker + R2 (MP3 için sonsuz saklama)

### Adımlar:
1. Cloudflare Dashboard > R2 > Create Bucket > isim: yulien-music

2. Bucket'a iki dosya yükle:
   - index.html (birthday sayfan)
   - yulien.mp3 (mp3'n)

3. Wrangler kur:
   npm install -g wrangler
   wrangler login

4. Deploy:
   wrangler deploy

### Sonuç:
- Siten: https://yulien-birthday.YOUR_SUBDOMAIN.workers.dev
- MP3'n: https://yulien-birthday.YOUR_SUBDOMAIN.workers.dev/music.mp3 (asla silinmez, R2 ücretsiz 10GB)

# HTML içindeki SECRET_MUSIC_URL'yi şu yap:
const SECRET_MUSIC_URL = "/music.mp3";
# Böylece kendi Cloudflare'inden çalar, Catbox'a bile gerek kalmaz
