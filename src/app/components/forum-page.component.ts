import { Component, OnInit } from '@angular/core';
import { PostSheetService } from '../services/post-sheet.service';
import { ForumPost } from '../services/model';
import { ModalService } from '../services/modal.service';

@Component({
    selector: 'app-forum-page',
    templateUrl: './forum-page.component.html',
    styleUrls: ['./forum-page.component.css']
})

export class ForumPageComponent implements OnInit {
    constructor(private postSheetService: PostSheetService, private modalService: ModalService) {
    }

    posts: ForumPost[];
    post: ForumPost;
    thread: ForumPost[];

    openPost(post: any) {
        this.postSheetService.getForumTopicThread(post.UUID).then(res => {
            this.post = res;
            this.post.level = 1;
            this.thread = [];

            const addToThread = (post, level) => {
                post.level = level;
                this.thread.push(post);
                post.children && post.children.forEach(child => addToThread(child, level + 1));
            };

            addToThread(this.post, 1);
            console.log(this.thread);
        });
    }

    ngOnInit(): void {
        this.postSheetService.getForumTopics().then(res => {
            this.posts = res;
        });
    }

    reply(post) {
        this.modalService.openNewForumtopicDialog({
            law: post.law,
            lang: post.lang,
            term: post.term,
            prototerm: post.protoTerm,
            parentUuid: post.UUID,
            rootUuid: post.ROOT_UUID || post.UUID,
            user: '',
        });
    }
}
