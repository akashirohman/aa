const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());

async function runBot(keyword, targetURL, proxy) {
  const browser = await puppeteer.launch({
    headless: true,
    args: [`--proxy-server=${proxy}`]
  });

  try {
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0 Safari/537.36');

    const searchURL = `https://www.google.com/search?q=${encodeURIComponent(keyword)}`;
    await page.goto(searchURL, { waitUntil: 'domcontentloaded', timeout: 15000 });

    const links = await page.$$eval('a', as => as.map(a => a.href));
    const found = links.find(link => link.includes(targetURL.replace(/^https?:\/\//, '')));

    if (found) {
      console.log(`[FOUND] Website ditemukan di hasil pencarian. Mengunjungi: ${found}`);
      await page.goto(found, { waitUntil: 'domcontentloaded', timeout: 15000 });

      await page.waitForTimeout(3000 + Math.random() * 3000); // Simulasi manusia
      await page.mouse.move(100 + Math.random() * 100, 200 + Math.random() * 200);
      await page.waitForTimeout(3000);
    } else {
      console.log(`[SKIP] Website tidak ditemukan di halaman 1-10 untuk keyword "${keyword}"`);
    }
  } catch (err) {
    console.log('[ERROR]', err.message);
  } finally {
    await browser.close();
  }
}

module.exports = { runBot };