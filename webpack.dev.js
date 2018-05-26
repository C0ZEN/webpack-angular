const path = require('path');
const helpers = require('./helpers');
const webpack = require('webpack');

module.exports = {
	mode        : 'development',
	resolve     : {

		// File extensions used in imports
		// Then importing files, the extension is always hidden
		// You must specify which type of extension the resolver could find to avoid error
		extensions: [
			'.js',
			'.ts'
		]
	},
	entry       : {
		polyfills: './src/polyfills.ts',
		vendors  : './src/vendors.ts',
		app      : './src/main.ts'
	},
	output      : {
		path         : path.resolve(__dirname, 'dist'),
		filename     : '[name].js',
		chunkFilename: '[name].[id].js'
	},
	module      : {
		rules: [

			// Parse TypeScript to JavaScript
			{
				test  : /\.ts$/,
				loader: 'awesome-typescript-loader'
			}
		]
	},
	plugins     : [

		// Workaround for Critical dependency
		// The request of a dependency is an expression in ./node_modules/@angular/core/fesm5/core.js
		new webpack.ContextReplacementPlugin(
			/\@angular(\\|\/)core(\\|\/)fesm5/,
			helpers.root('./src')
		),

		// Workaround for https://github.com/angular/angular/issues/11580
		new webpack.ContextReplacementPlugin(
			/\@angular\b.*\b(bundles|linker)/,
			helpers.root('./src')
		),

		// Workaround for https://github.com/angular/angular/issues/14898
		new webpack.ContextReplacementPlugin(
			/angular(\\|\/)core(\\|\/)@angular/,
			helpers.root('./src')
		),

		// Workaround for https://github.com/angular/angular/issues/20357
		new webpack.ContextReplacementPlugin(
			/\@angular(\\|\/)core(\\|\/)esm5/,
			helpers.root('./src')
		),

		// Workaround for https://github.com/stefanpenner/es6-promise/issues/100
		new webpack.IgnorePlugin(/^vertx$/)
	],
	optimization: {

		// Extract common dependencies (the one that are both included in vendors and scripts)
		splitChunks: {
			chunks: 'all'
		}
	}
};
