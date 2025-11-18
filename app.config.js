export default ({ config }) => {
  const appEnv = process.env.APP_ENV || "development";

  const envConfigs = {
    development: {
      apiUrl: "https://api.geekifypeople.geekify.global/api/v1",
    },
    staging: {
      apiUrl: "https://staging.api.tradieplus.com",
    },
    production: {
      apiUrl: "https://api.tradieplus.com",
    },
  };

  return {
    ...config,
    extra: {
      ...config.extra,
      env: appEnv,
      apiUrl: envConfigs[appEnv].apiUrl,
      EXPO_PUBLIC_API_URL: envConfigs[appEnv].apiUrl,
    },
  };
};
