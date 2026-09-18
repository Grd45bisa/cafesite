module.exports = {
  apps: [
    {
      name: "cafesite-wa-bot",
      script: "dist/index.js",
      cwd: __dirname,
      max_memory_restart: "300M",
      kill_timeout: 3000,
      restart_delay: 3000,
      autorestart: true,
      // Bot ini hanya boleh 1 instance - session WhatsApp (LocalAuth) terikat
      // ke satu proses Chromium, cluster mode akan bikin beberapa proses
      // rebutan folder server/session/.
      instances: 1,
      exec_mode: "fork",
    },
  ],
};
