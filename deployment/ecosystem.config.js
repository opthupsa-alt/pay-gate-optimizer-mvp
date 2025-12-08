// PM2 Ecosystem Configuration for PayGate Optimizer
// ==================================================
// انسخ هذا الملف إلى جذر المشروع
// Copy this file to project root

module.exports = {
  apps: [
    {
      // اسم التطبيق
      name: 'paygate',
      
      // ملف التشغيل
      script: 'node_modules/.bin/next',
      args: 'start',
      
      // مجلد العمل
      cwd: './',
      
      // عدد النسخ (0 = عدد الـ CPU cores)
      instances: 1,
      
      // تفعيل Cluster mode
      exec_mode: 'fork',
      
      // إعادة التشغيل التلقائي
      autorestart: true,
      
      // مراقبة الملفات للتغييرات
      watch: false,
      
      // الحد الأقصى للذاكرة قبل إعادة التشغيل
      max_memory_restart: '500M',
      
      // المتغيرات البيئية
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      
      // متغيرات الإنتاج
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
        DEMO_MODE: 'true',
      },
      
      // إعدادات الـ Logs
      log_file: './logs/combined.log',
      out_file: './logs/out.log',
      error_file: './logs/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      
      // عدد محاولات إعادة التشغيل
      max_restarts: 10,
      
      // الانتظار بين المحاولات (بالملي ثانية)
      restart_delay: 4000,
      
      // تجاهل الملفات
      ignore_watch: [
        'node_modules',
        '.next',
        'logs',
        '.git',
      ],
    },
  ],
};

