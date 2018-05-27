import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {environment} from './environments/environment';
import {AppModule} from './app/app.module';
import {hmrBootstrap} from './hmr';
import {NgModuleRef} from '@angular/core/src/linker/ng_module_factory';

if (environment.production) {
	enableProdMode();
}

const bootstrap: any = (): Promise<NgModuleRef<any>> => platformBrowserDynamic()
	.bootstrapModule(AppModule);

if (environment.hmr) {
	if (module['hot']) {
		hmrBootstrap(module, bootstrap);
		console.info('HMR is enabled for webpack-dev-server');
	} else {
		console.error('HMR is not enabled for webpack-dev-server');
	}
} else {
	bootstrap().catch((error: any) => {
		console.error(error);
	});
}
