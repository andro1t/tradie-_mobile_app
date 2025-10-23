import Constants from 'expo-constants';

const { apiUrl, env } = Constants.expoConfig.extra;

export default {
  API_URL: apiUrl,
  ENV: env,
};
