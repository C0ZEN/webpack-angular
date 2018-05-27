const merge = require('webpack-merge');
const webpackCommon = require('./webpack/webpack.common');
const webpackDev = require('./webpack/webpack.dev');
const webpackProd = require('./webpack/webpack.prod');
const commonConfig = merge([
	webpackCommon
]);
const devConfig = merge([
	webpackDev
]);
const prodConfig = merge([
	webpackProd
]);

module.exports = mode => {
	if (mode === 'production') {
		return merge(commonConfig, prodConfig, {mode});
	}
	return merge(commonConfig, devConfig, {mode});
};
