import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { DatabaseModule } from './database/database.module';
import { NgModule } from '@angular/core';
import { NavbarComponent } from './navbar/navbar.component';
import { ToolExplanationComponent } from './tool-explanation/tool-explanation.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DevelopmentProcessesModule } from './development-processes/development-processes.module';
import { DevelopmentProcessRegistryModule } from './development-process-registry/development-process-registry.module';
import { OptionsComponent } from './options/options.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    OptionsComponent,
    ToolExplanationComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DatabaseModule,
    DevelopmentProcessRegistryModule,
    NgbModule,
    ReactiveFormsModule,

    DevelopmentProcessesModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
