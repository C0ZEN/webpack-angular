const helpers = require('../helpers');

module.exports = {
	profile  : true,
	parallelism: 1,
	devServer: {
		host    : 'localhost',
		port    : '8001',
		open    : true,
		overlay : true,
		hot     : true,
		progress: true
	},
	module   : {
		rules: [
			{
				test   : /\.ts$/,
				enforce: 'pre',
				use    : [

					// TSLint analysis
					{
						loader : 'tslint-loader',
						options: {
							configFile  : 'tslint.json',
							emitErrors  : true,
							failOnHint  : false,
							typeCheck   : false,
							fix         : true,
							tsConfigFile: 'tsconfig.json'
						}
					}
				]
			},
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
	optimization: {
		minimize: false
	}
};
