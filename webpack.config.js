const createExpoWebpackConfigAsync = require("@expo/webpack-config")

module.exports = async (env, argv) => {
  const config = await createExpoWebpackConfigAsync(
    {
      ...env,
      babel: {
        dangerouslyAddModulePathsToTranspile: ["@expo/vector-icons"],
      },
    },
    argv,
  )

  // Customize the config before returning it
  config.resolve.alias = {
    ...config.resolve.alias,
    "react-native$": "react-native-web",
    "react-native-svg": "react-native-svg/lib/commonjs/ReactNativeSVG.web",
  }

  return config
}
