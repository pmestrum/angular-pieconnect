import { Component, OnInit } from '@angular/core';
import { PostSheetService } from '../services/post-sheet.service';

@Component({
    selector: 'app-forum-page',
    templateUrl: './forum-page.component.html',
    styleUrls: ['./forum-page.component.css']
})

export class ForumPageComponent {
    constructor(private postSheetService: PostSheetService) {}
}
