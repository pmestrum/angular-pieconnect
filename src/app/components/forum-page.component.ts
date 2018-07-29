import { Component, OnInit } from '@angular/core';
import { PostSheetService } from '../services/post-sheet.service';

@Component({
    selector: 'app-forum-page',
    templateUrl: './forum-page.component.html',
    styleUrls: ['./forum-page.component.css']
})

export class ForumPageComponent {
    constructor(private postSheetService: PostSheetService) {}

    postToForum() {
        this.postSheetService.postToForum(1, 'sdfsdf', 'ikke', 'Mijn post over deze topic');
    }
    postToFeedback() {
        this.postSheetService.postFeedback(1, 'ikke', 'Dit is een test van ' + new Date());
    }
    getForumData() {
        this.postSheetService.getForumData();
    }
}
