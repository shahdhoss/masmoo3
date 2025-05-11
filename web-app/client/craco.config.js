module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.output.filename = 'static/js/[name].[contenthash:8].js';
      webpackConfig.output.chunkFilename = 'static/js/[name].[contenthash:8].chunk.js';
      
      const cssPlugin = webpackConfig.plugins.find(
        plugin => plugin.constructor.name === 'MiniCssExtractPlugin'
      );
      if (cssPlugin) {
        cssPlugin.options.filename = 'static/css/[name].[contenthash:8].css';
        cssPlugin.options.chunkFilename = 'static/css/[name].[contenthash:8].chunk.css';
      }
      
      return webpackConfig;
    }
  }
};