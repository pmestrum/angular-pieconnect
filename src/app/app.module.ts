import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { DataService } from './data.service';
import { AppComponent } from "./app.component";
import { MatTableModule } from '@angular/material/table';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, MatTableModule],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule {}
