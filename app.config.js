export default ({ config }) => {
  const appEnv = process.env.APP_ENV || 'development';

  const envConfigs = {
    development: {
      apiUrl: 'https://dev.api.tradieplus.com',
    },
    staging: {
      apiUrl: 'https://staging.api.tradieplus.com',
    },
    production: {
      apiUrl: 'https://api.tradieplus.com',
    },
  };

  return {
    ...config,
    extra: {
      ...config.extra,
      env: appEnv,
      apiUrl: envConfigs[appEnv].apiUrl,
    },
  };
};
