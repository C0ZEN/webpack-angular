const helpers = require('../helpers');
const Webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const ErrorOverlayPlugin = require('error-overlay-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
	context:      helpers.root(),
	profile:      false,
	parallelism:  4,
	resolve:      {

		// File extensions used in imports
		// Then importing files, the extension is always hidden
		// You must specify which type of extension the resolver could find to avoid error
		extensions: [
			'.js',
			'.ts',
			'.scss'
		]
	},
	entry:        {
		polyfills:      './src/polyfills.ts',
		vendors:        './src/vendors.ts',
		app:            './src/main.ts',
		bootstrap:      './src/assets/scss/bootstrap.scss',
		'font-awesome': './src/assets/scss/font-awesome.scss',
		style:          './src/assets/scss/styles.scss'
	},
	output:       {
		path:          helpers.root('dist'),
		filename:      '[name].js',
		chunkFilename: '[name].[id].js'
	},
	plugins:      [

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
			inject:          false,
			template:        require('html-webpack-template'),
			title:           'Angular Webpack demo',
			meta:            [
				{
					name:    'description',
					content: 'An Angular 6 project with a complete custom webpack configuration'
				}
			],
			mobile:          true,
			lang:            'en-US',
			bodyHtmlSnippet: '<app-root></app-root>',
			cache:           false
		}),

		// Generate the favicon into the index.html file
		new FaviconsWebpackPlugin({
			logo:            helpers.root('src/assets/icons/png/512/icons8-rocket-512.png'),
			prefix:          'icons-[hash]/',
			emitStats:       false,
			persistentCache: true,
			inject:          true,
			background:      'transparent',
			icons:           {
				android:      true,
				appleIcon:    true,
				appleStartup: true,
				coast:        true,
				favicons:     true,
				firefox:      true,
				opengraph:    true,
				twitter:      true,
				yandex:       true,
				windows:      true
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
		}),

		// Output the global styles from assets
		new MiniCssExtractPlugin({
			filename:      '[name].css',
			chunkFilename: '[id].css'
		}),

		new CopyWebpackPlugin([
			{
				from: 'src/assets/icons',
				to:   'icons',
				cache: true
			}
		])
	],
	optimization: {

		// Extract common dependencies (the one that are both included in vendors and scripts)
		splitChunks: {
			chunks: 'all'
		},
		minimize:    true
	},
	stats:        {
		colors:       true,
		errors:       true,
		errorDetails: true
	},
	performance:  {
		// hints: 'error'
	}
};
