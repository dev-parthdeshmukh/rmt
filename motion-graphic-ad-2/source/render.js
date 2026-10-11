// Usage: node render.js stills 1.5 4 9 ...   -> stills/t_<t>.png
//        node render.js video out.mp4 [fps] [duration]
let playwright;
try { playwright = require('playwright'); } catch { playwright = require('/opt/node22/lib/node_modules/playwright'); }
const { chromium } = playwright;
const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const ROOT = __dirname;
const TYPES = { '.html': 'text/html', '.png': 'image/png', '.ttf': 'font/ttf', '.js': 'text/javascript' };

function serve() {
  return new Promise(res => {
    const srv = http.createServer((req, rsp) => {
      const p = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]));
      fs.readFile(p, (err, buf) => {
        if (err) { rsp.writeHead(404); return rsp.end(); }
        rsp.writeHead(200, { 'Content-Type': TYPES[path.extname(p)] || 'application/octet-stream' });
        rsp.end(buf);
      });
    }).listen(0, () => res(srv));
  });
}

(async () => {
  const [mode, ...args] = process.argv.slice(2);
  const srv = await serve();
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  page.on('console', m => console.log('[page]', m.text()));
  page.on('pageerror', e => console.log('[pageerror]', e.message));
  await page.goto(`http://localhost:${srv.address().port}/index.html`);
  await page.evaluate(() => window.ready);

  if (mode === 'stills') {
    fs.mkdirSync(path.join(ROOT, 'stills'), { recursive: true });
    for (const a of args) {
      const t = parseFloat(a);
      await page.evaluate(t => window.render(t), t);
      await page.screenshot({ path: path.join(ROOT, 'stills', `t_${a}.png`) });
      console.log('still', a);
    }
  } else {
    const out = args[0] || 'out.mp4';
    const fps = parseInt(args[1] || '30', 10);
    const dur = parseFloat(args[2] || '40');
    const n = Math.round(fps * dur);
    const ff = spawn('ffmpeg', ['-y', '-hide_banner', '-loglevel', 'error',
      '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'png', '-i', '-',
      '-c:v', 'libx264', '-preset', 'slow', '-crf', '16', '-pix_fmt', 'yuv420p', '-tune', 'animation', out],
      { stdio: ['pipe', 'inherit', 'inherit'] });
    const t0 = Date.now();
    for (let f = 0; f < n; f++) {
      const t = f / fps;
      await page.evaluate(t => window.render(t), t);
      const buf = await page.screenshot({ type: 'png' });
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
      if (f % 60 === 0) console.log(`frame ${f}/${n}  ${((Date.now() - t0) / 1000).toFixed(0)}s`);
    }
    ff.stdin.end();
    await new Promise(r => ff.on('close', r));
    console.log('done', out);
  }
  await browser.close();
  srv.close();
})();
