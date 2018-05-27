import {
	ApplicationRef,
	ComponentRef,
	NgModuleRef
} from '@angular/core';
import {createNewHosts} from '@angularclass/hmr';

export const hmrBootstrap: any = (
	module: any,
	bootstrap: () => Promise<NgModuleRef<any>>
): any => {
	let ngModule: NgModuleRef<any>;
	module.hot.accept();
	bootstrap().then(
		(mod: any) => ngModule = mod);
	module.hot.dispose(() => {
		const appRef: ApplicationRef = ngModule.injector.get(ApplicationRef);
		const elements: any          = appRef.components.map(
			(c: ComponentRef<any>) => c.location.nativeElement);
		const makeVisible: any       = createNewHosts(elements);
		ngModule.destroy();
		makeVisible();
	});
};
