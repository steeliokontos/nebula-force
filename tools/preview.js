/* Art preview harness — screenshots the real game so art changes can be SEEN.
   For Claude Code sessions (uses the pre-installed Playwright + Chromium);
   not part of the game, not needed to play.

   Usage: NODE_PATH=/opt/node22/lib/node_modules node tools/preview.js <outdir>
   Writes: town-*.png (five camera spots), sprites-0/1.png (both animation
   phases of every sprite), tiles.png (every baked town tile, both variants). */
const path = require('path');
const { chromium } = require('playwright');

const REPO = path.join(__dirname, '..');
const OUT = process.argv[2] || '.';

(async () => {
  const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
    args: ['--no-sandbox'],
  });
  const page = await browser.newPage({ viewport: { width: 900, height: 900 } });
  page.on('pageerror', e => console.log('PAGE ERROR:', e.message));
  await page.goto('file://' + path.join(REPO, 'index.html'));
  await page.waitForTimeout(400);

  // skip boot prompt / intro movie, land in town in walk state
  await page.evaluate(() => {
    localStorage.clear();
    iv = null; rf = null; dlgActive = false;
    setMode('town'); tstate = 'walk';
  });
  await page.waitForTimeout(300);
  const cv = page.locator('#view');

  async function shotAt(x, y, name, ms = 600) {
    await page.evaluate(([tx, ty]) => {
      hero.x = tx; hero.y = ty;
      hero.px = tx * TS; hero.py = ty * TS;
      hero.moving = false;
      tCamInit = false; // snap camera to the new spot
    }, [x, y]);
    await page.waitForTimeout(ms);
    await cv.screenshot({ path: path.join(OUT, name) });
    console.log('wrote', name);
  }
  await shotAt(14, 12, 'town-plaza.png');
  await shotAt(23, 3, 'town-ridge.png');
  await shotAt(20, 18, 'town-lower.png');
  await shotAt(7, 9, 'town-west.png');
  await shotAt(28, 11, 'town-east.png');

  // halt the RAF loop (it clears the canvas every frame), then draw sheets
  await page.evaluate(() => { frame = () => {}; });
  await page.waitForTimeout(150);

  for (const phase of [0, 1]) {
    await page.evaluate((ph) => {
      animPhase = ph;
      cx.fillStyle = '#3a3048'; cx.fillRect(0, 0, cv.width, cv.height);
      const names = Object.keys(SPRITES);
      let x = 30, y = 8;
      cx.font = '8px monospace';
      for (const n of names) {
        const rows = SPRITES[n];
        const w = rows[0].length * 3;
        if (x + w > cv.width - 10) { x = 30; y += 92; }
        if (y > cv.height - 90) break; // sheet is full; big cinematic sprites omitted
        cx.fillStyle = 'rgba(0,0,0,.35)';
        cx.beginPath(); cx.ellipse(x + w / 2 - 15, y + 62, 13, 4, 0, 0, 7); cx.fill();
        drawSprite(cx, n, x + w / 2 - 15, y + 64, 3, false, 0);
        cx.fillStyle = '#fff';
        cx.fillText(n, x - 15, y + 76);
        x += w + 40;
      }
    }, phase);
    await cv.screenshot({ path: path.join(OUT, `sprites-${phase}.png`) });
    console.log('wrote sprites-' + phase + '.png');
  }

  await page.evaluate(() => {
    cx.fillStyle = '#101018'; cx.fillRect(0, 0, cv.width, cv.height);
    let x = 6, y = 6;
    cx.font = '9px monospace';
    for (const k of Object.keys(townTiles)) {
      if (x + 110 > cv.width) { x = 6; y += 62; }
      cx.drawImage(townTiles[k][0], x, y);
      cx.drawImage(townTiles[k][1], x + 52, y);
      cx.fillStyle = '#fff';
      cx.fillText(k, x + 104, y + 26);
      x += 118;
    }
  });
  await cv.screenshot({ path: path.join(OUT, 'tiles.png') });
  console.log('wrote tiles.png');

  await browser.close();
})();
