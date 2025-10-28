module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Optional: enable absolute imports using @
      ['module-resolver', {
        root: ['./'],
        alias: {
          '@app': './app',
          '@assets': './assets',
          '@components': './components',
          '@config': './config',
          '@constants': './constants',
        },
      }],
      // Optional: for Reanimated 3
      'react-native-reanimated/plugin',
    ],
  };
};
