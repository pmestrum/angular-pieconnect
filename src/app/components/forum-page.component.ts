import { Component, OnInit } from '@angular/core';
import { PostSheetService } from '../services/post-sheet.service';
import { ForumPost, ForumPosts } from '../services/model';
import { ModalService } from '../services/modal.service';

@Component({
    selector: 'app-forum-page',
    templateUrl: './forum-page.component.html',
    styleUrls: ['./forum-page.component.css']
})

export class ForumPageComponent implements OnInit {
    constructor(private postSheetService: PostSheetService, private modalService: ModalService) {
    }

    posts: ForumPosts;
    post: ForumPost;
    thread: ForumPost[];
    busy = true;

    openPost(post: any) {
        if (!this.busy) {
            this.busy = true;
            this.postSheetService.getForumTopicThread(post.UUID).then(res => {
                this.busy = false;
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
    }

    ngOnInit(): void {
        this.postSheetService.getForumTopics().then(res => {
            this.busy = false;
            this.posts = res;
        });
    }

    reply(post) {
        if (!this.busy) {
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

    arrayOf(size) {
        return Array(size);
    }
}
