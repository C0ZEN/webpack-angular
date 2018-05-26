import {AppComponent} from './app.component';
import {BrowserModule} from '@angular/platform-browser';
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

@NgModule({
	declarations: [
		AppComponent
	],
	imports     : [
		CommonModule,
		BrowserModule
	],
	bootstrap   : [AppComponent]
})

export class AppModule {
}
