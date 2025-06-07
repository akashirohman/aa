const figlet = require('figlet');
const chalk = require('chalk');
const inquirer = require('inquirer');
const fs = require('fs');
const { runBot } = require('./src/bot');
const { fetchProxies } = require('./src/proxy');

// Show welcome banner
console.clear();
console.log(chalk.cyan(figlet.textSync('SEOSAMUDERA', { horizontalLayout: 'full' })));
console.log(chalk.yellowBright('SELAMAT DATANG BOSKU AKASHI ARROCHMAN!'));
console.log(chalk.greenBright('SELAMAT BERAKSELERASI ^_^'));
console.log(chalk.magentaBright('SELAMAT DATANG DI SEOSAMUDERA BOT\n'));

(async () => {
  try {
    // Load available keyword files
    const keywordDir = './keywords';
    const keywordFiles = fs.readdirSync(keywordDir).filter(f => f.endsWith('.txt'));

    const { targetURL, keywordFile } = await inquirer.prompt([
      {
        type: 'input',
        name: 'targetURL',
        message: 'Masukkan URL target website:',
        validate: input => input.startsWith('http') || 'Masukkan URL valid (http/https)',
      },
      {
        type: 'list',
        name: 'keywordFile',
        message: 'Pilih file keyword:',
        choices: keywordFiles,
      }
    ]);

    console.log(chalk.blue('[INFO] Mengambil proxy gratis...'));
    const proxies = await fetchProxies();
    console.log(chalk.green(`[INFO] Total proxy aktif: ${proxies.length}`));

    const keywords = fs.readFileSync(`${keywordDir}/${keywordFile}`, 'utf-8')
      .split('\n')
      .map(k => k.trim())
      .filter(Boolean);

    for (const keyword of keywords) {
      const proxy = proxies[Math.floor(Math.random() * proxies.length)];
      console.log(chalk.cyan(`[BOT] Menjalankan bot dengan keyword: "${keyword}" dan proxy: ${proxy}`));

      try {
        await runBot(keyword, targetURL, proxy);
      } catch (err) {
        console.log(chalk.red(`[ERROR] Gagal menjalankan bot untuk keyword "${keyword}": ${err.message}`));
      }

      // Optional delay 1-2 detik supaya bot tidak terlalu cepat
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
  } catch (err) {
    console.error(chalk.red('[FATAL ERROR]'), err);
  }
})();
