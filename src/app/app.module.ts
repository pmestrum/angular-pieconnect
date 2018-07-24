import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { DataService } from './services/data.service';
import { AppComponent } from './app.component';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule, MatInputModule, MatPaginatorModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { MapPageComponent } from './components/map-page.component';
import { AboutPageComponent } from './components/about-page.component';
import { ForumPageComponent } from './components/forum-page.component';
import { LinksPageComponent } from './components/links-page.component';
import { AppRoutingModule } from './app.routing.module';

@NgModule({
  declarations: [AppComponent, MapPageComponent, AboutPageComponent, ForumPageComponent, LinksPageComponent],
  imports: [
      BrowserModule,
      MatTableModule,
      MatFormFieldModule,
      MatPaginatorModule,
      MatInputModule,
      BrowserAnimationsModule,
      LeafletModule.forRoot(),
      AppRoutingModule
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule {}
