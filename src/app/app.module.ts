import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { DataService } from './data.service';
import { AppComponent } from './app.component';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule, MatInputModule, MatPaginatorModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, MatTableModule, MatFormFieldModule, MatPaginatorModule, MatInputModule, BrowserAnimationsModule],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule {}
