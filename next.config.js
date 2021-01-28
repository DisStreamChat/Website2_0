const webpack = require("webpack")

module.exports = {
	images: {
		domains: ["localhost", "disstreamchat.com"],
	},
	webpack: (config, {dev}) => {
		config.plugins = config.plugins.filter(
      			(plugin) => (plugin.constructor.name !== ‘UglifyJsPlugin’)
   		)
   		config.plugins.push(
      			new webpack.optimize.UglifyJsPlugin()
   		)
   		return config	
	}
};
