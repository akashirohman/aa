const axios = require('axios');

async function fetchProxies() {
  try {
    const res = await axios.get('https://raw.githubusercontent.com/TheSpeedX/PROXY-List/master/http.txt');
    const lines = res.data.split('\n');
    return lines.filter(ip => ip && ip.includes(':')).slice(0, 100);
  } catch (err) {
    console.log('[PROXY] Gagal mengambil proxy otomatis, gunakan proxy lokal');
    return require('fs').readFileSync('proxies.txt', 'utf-8').split('\n').filter(Boolean);
  }
}

module.exports = { fetchProxies };