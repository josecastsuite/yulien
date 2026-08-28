// Cloudflare Worker - Yulien Birthday Surprise
// MP3'yi R2'ye yükle, sonsuza kadar silinmez + Catbox yedekli

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // MP3 endpoint - /music.mp3 veya /mp3
    if (url.pathname === '/music.mp3' || url.pathname === '/mp3') {
      try {
        // 1. Önce R2'den dene (kalıcı)
        if (env.MUSIC_BUCKET) {
          const object = await env.MUSIC_BUCKET.get('yulien.mp3');
          if (object) {
            const headers = new Headers();
            object.writeHttpMetadata(headers);
            headers.set('Content-Type', 'audio/mpeg');
            headers.set('Cache-Control', 'public, max-age=31536000, immutable');
            headers.set('Access-Control-Allow-Origin', '*');
            return new Response(object.body, { headers });
          }
        }
        
        // 2. R2'de yoksa Catbox'tan proxy'le (yedek) - CORS sorununu çözer
        const CATBOX_URL = 'https://files.catbox.moe/XXXXXX.mp3'; // BURAYI KENDI CATBOX LINKINLE DEGISTIR
        const res = await fetch(CATBOX_URL);
        const newHeaders = new Headers(res.headers);
        newHeaders.set('Cache-Control', 'public, max-age=86400');
        newHeaders.set('Access-Control-Allow-Origin', '*');
        newHeaders.set('Content-Type', 'audio/mpeg');
        return new Response(res.body, { status: res.status, headers: newHeaders });
        
      } catch (e) {
        return new Response('Music not found: ' + e.message, { status: 404 });
      }
    }

    // Ana sayfa - birthday HTML'i R2'den veya KV'den veya inline
    if (url.pathname === '/' || url.pathname.endsWith('.html')) {
      try {
        // R2'den HTML dene
        if (env.MUSIC_BUCKET) {
          const htmlObj = await env.MUSIC_BUCKET.get('index.html');
          if (htmlObj) {
            const headers = new Headers();
            headers.set('Content-Type', 'text/html; charset=utf-8');
            headers.set('Cache-Control', 'public, max-age=3600');
            return new Response(htmlObj.body, { headers });
          }
        }
        // Fallback - basit landing
        return new Response(`<!DOCTYPE html><html><head><meta charset="utf-8"><meta http-equiv="refresh" content="0; url=/index.html"></head><body>Redirecting...</body></html>`, {
          headers: { 'Content-Type': 'text/html' }
        });
      } catch (e) {
        return new Response('Error: ' + e.message, { status: 500 });
      }
    }

    return new Response('Not found', { status: 404 });
  }
}
