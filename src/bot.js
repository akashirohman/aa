const puppeteer = require('puppeteer');

async function runBot(keyword, targetURL, proxy) {
  const launchOptions = {
    headless: 'new', // mode headless terbaru
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      proxy ? `--proxy-server=${proxy}` : ''
    ].filter(Boolean),
  };

  const browser = await puppeteer.launch(launchOptions);
  const page = await browser.newPage();

  // Contoh set user agent random sederhana
  await page.setUserAgent(`Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0 Safari/537.36`);

  try {
    await page.goto(targetURL, { waitUntil: 'networkidle2', timeout: 60000 });

    // Misal ada input search dengan selector '#search' (ubah sesuai target)
    await page.type('#search', keyword, { delay: 100 });

    // Tunggu sebentar simulasi user klik enter atau cari tombol cari, contoh klik tombol cari:
    // await page.click('#search-button');

    await page.waitForTimeout(3000); // tunggu 3 detik supaya page loading dll

  } catch (error) {
    throw new Error(`runBot error: ${error.message}`);
  } finally {
    await browser.close();
  }
}

module.exports = { runBot };
