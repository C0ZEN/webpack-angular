const path = require('path');
const helpers = require('./helpers');
const webpack = require('webpack');
const htmlWebpackPlugin = require('html-webpack-plugin');

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
		path         : helpers.root('dist'),
		filename     : '[name].js',
		chunkFilename: '[name].[id].js'
	},
	module      : {
		rules: [
			{
				test   : /\.ts$/,
				loaders: [

					// Parse TypeScript to JavaScript
					{
						loader : 'awesome-typescript-loader',
						options: {
							configFileName: helpers.root('tsconfig.json')
						}
					},

					// Add require(...) as prefix for templateUrl and styleUrls in Angular components
					// This way allow the loader to inject external files as inline data
					'angular2-template-loader'
				]
			},

			// Extract html files
			{
				test  : /\.html$/,
				loader: 'html-loader'
			}
		]
	},
	plugins     : [

		// Workaround for Critical dependency
		// The request of a dependency is an expression in ./node_modules/@angular/core/fesm5/core.js
		new webpack.ContextReplacementPlugin(
			/\@angular(\\|\/)core(\\|\/)fesm5/,
			helpers.root('src')
		),

		// Workaround for https://github.com/angular/angular/issues/11580
		new webpack.ContextReplacementPlugin(
			/\@angular\b.*\b(bundles|linker)/,
			helpers.root('src')
		),

		// Workaround for https://github.com/angular/angular/issues/14898
		new webpack.ContextReplacementPlugin(
			/angular(\\|\/)core(\\|\/)@angular/,
			helpers.root('src')
		),

		// Workaround for https://github.com/angular/angular/issues/20357
		new webpack.ContextReplacementPlugin(
			/\@angular(\\|\/)core(\\|\/)esm5/,
			helpers.root('src')
		),

		// Workaround for https://github.com/stefanpenner/es6-promise/issues/100
		new webpack.IgnorePlugin(/^vertx$/),

		// Generate the index.html file
		new htmlWebpackPlugin({
			title: 'Angular Webpack demo'
		})
	],
	optimization: {

		// Extract common dependencies (the one that are both included in vendors and scripts)
		splitChunks: {
			chunks: 'all'
		}
	}
};
