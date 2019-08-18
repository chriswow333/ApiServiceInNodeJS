module.exports = {
    /**
     * Application configuration section
     * http://pm2.keymetrics.io/docs/usage/application-declaration/
     */
    apps: [
        // First application
        {
            name: 'WEB-API',
            script: 'web-app.js',
            exec_mode: "cluster",
            instances: 0,
            env: { COMMON_VARIABLE: 'true', NODE_ENV: 'production' },
            env_production: { NODE_ENV: 'production' },
            // Watching system does not provide any graceful action,
            // pm2 kills and restarts your application without sending SIGINT
            watch: true,
            ignore_watch: ["node_modules", "public"],
            watch_options: {
                followSymlinks: false
            }
        }
    ]

    /**
     * Deployment section
     * http://pm2.keymetrics.io/docs/usage/deployment/
     */
    /* deploy : {
       production : {
         user : 'node',
         host : '212.83.163.1',
         ref  : 'origin/master',
         repo : 'git@github.com:repo.git',
         path : '/var/www/production',
         'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production'
       },
       dev : {
         user : 'node',
         host : '212.83.163.1',
         ref  : 'origin/master',
         repo : 'git@github.com:repo.git',
         path : '/var/www/development',
         'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env dev',
         env  : {
           NODE_ENV: 'dev'
         }
       }
     }*/
};