import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { DataService } from './services/data.service';
import { AppComponent } from './app.component';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule, MatFormFieldModule, MatInputModule, MatPaginatorModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { MapPageComponent } from './components/map-page.component';
import { AboutPageComponent } from './components/about-page.component';
import { ForumPageComponent } from './components/forum-page.component';
import { LinksPageComponent } from './components/links-page.component';
import { AppRoutingModule } from './app.routing.module';
import { PostSheetService } from './services/post-sheet.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FeedbackDialogComponent } from './components/feedback-dialog.component';
import { FeedbackService } from './services/feedback.service';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
    declarations: [
        AppComponent,
        MapPageComponent,
        AboutPageComponent,
        ForumPageComponent,
        LinksPageComponent,
        FeedbackDialogComponent
    ],
    imports: [
        BrowserModule,
        MatTableModule,
        MatFormFieldModule,
        MatPaginatorModule,
        MatInputModule,
        BrowserAnimationsModule,
        LeafletModule.forRoot(),
        AppRoutingModule,
        HttpClientModule,
        MatDialogModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule, // required animations module
        ToastrModule.forRoot() // ToastrModule added
    ],
    entryComponents: [FeedbackDialogComponent],
    providers: [DataService, PostSheetService, FeedbackService],
    bootstrap: [AppComponent]
})
export class AppModule {
}
