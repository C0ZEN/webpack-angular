const helpers = require('./helpers');
const Webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const ErrorOverlayPlugin = require('error-overlay-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

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
	devServer   : {
		host   : 'localhost',
		port   : '8001',
		open   : true,
		overlay: true,
		hot    : true
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
		new Webpack.ContextReplacementPlugin(
			/\@angular(\\|\/)core(\\|\/)fesm5/,
			helpers.root('src')
		),

		// Workaround for https://github.com/angular/angular/issues/11580
		new Webpack.ContextReplacementPlugin(
			/\@angular\b.*\b(bundles|linker)/,
			helpers.root('src')
		),

		// Workaround for https://github.com/angular/angular/issues/14898
		new Webpack.ContextReplacementPlugin(
			/angular(\\|\/)core(\\|\/)@angular/,
			helpers.root('src')
		),

		// Workaround for https://github.com/angular/angular/issues/20357
		new Webpack.ContextReplacementPlugin(
			/\@angular(\\|\/)core(\\|\/)esm5/,
			helpers.root('src')
		),

		// Workaround for https://github.com/stefanpenner/es6-promise/issues/100
		new Webpack.IgnorePlugin(/^vertx$/),

		// Generate the index.html file
		new HtmlWebpackPlugin({
			inject         : false,
			template       : require('html-webpack-template'),
			title          : 'Angular Webpack demo',
			meta           : [
				{
					name   : 'description',
					content: 'An Angular 6 project with a complete custom webpack configuration'
				}
			],
			mobile         : true,
			lang           : 'en-US',
			bodyHtmlSnippet: '<app-root></app-root>',
			cache          : false
		}),

		// Generate the favicon into the index.html file
		new FaviconsWebpackPlugin({
			logo           : helpers.root('src/assets/icons/512/icons8-rocket-512.png'),
			prefix         : 'icons-[hash]/',
			emitStats      : false,
			persistentCache: true,
			inject         : true,
			background     : 'transparent',
			icons          : {
				android     : true,
				appleIcon   : true,
				appleStartup: true,
				coast       : true,
				favicons    : true,
				firefox     : true,
				opengraph   : true,
				twitter     : true,
				yandex      : true,
				windows     : true
			}
		}),

		// Add more options over the scripts attributes
		new ScriptExtHtmlWebpackPlugin({
			defaultAttribute: 'defer'
		}),

		// Display an overlay with the error when running the webpack dev-server
		new ErrorOverlayPlugin(),

		// Enable the Hot Module Replacement
		new Webpack.HotModuleReplacementPlugin(),

		// Output better errors and warnings
		new FriendlyErrorsWebpackPlugin({
			clearConsole: true
		})
	],
	optimization: {

		// Extract common dependencies (the one that are both included in vendors and scripts)
		splitChunks: {
			chunks: 'all'
		}
	},
	stats       : {
		colors      : true,
		errors      : true,
		errorDetails: true
	}
};
