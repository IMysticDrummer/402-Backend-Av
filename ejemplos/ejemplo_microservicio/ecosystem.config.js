module.exports = {
  apps: [
    {
      name: 'myapp',
      script: 'app.js',
      watch: './app.js',
      env_production: {
        NODE_ENV: 'production',
      },
      env_development: {
        NODE_ENV: 'developement',
      },
      log_date_format: 'YYYY-MM-DD HH:mm',
    },
    {
      script: 'conversionService.js',
      watch: ['./conversionService.js'],
      log_date_format: 'YYYY-MM-DD HH:mm',
    },
  ],

  deploy: {
    production: {
      user: 'SSH_USERNAME',
      host: 'SSH_HOSTMACHINE',
      ref: 'origin/master',
      repo: 'GIT_REPOSITORY',
      path: 'DESTINATION_PATH',
      'pre-deploy-local': '',
      'post-deploy':
        'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': '',
    },
  },
};
