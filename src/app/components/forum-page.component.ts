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
    busyPromise: Promise<any>;

    openPost(post: any) {
        if (!this.busy) {
            this.busy = true;
            this.busyPromise = this.postSheetService.getForumTopicThread(post.UUID);
            this.busyPromise.then(res => {
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
        this.busyPromise = this.postSheetService.getForumTopics();
        this.busyPromise.then(res => {
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
                level: post.level
            }).then((forumPost: ForumPost) => {
                let i = null;
                let found = false;
                let foundLevel = null;
                this.thread.forEach((p, index) => {
                    found = found || p.UUID === post.UUID;
                    if (found) {
                        if (foundLevel === null) {
                            foundLevel = p.level;
                        } else {
                            if (i === null && p.level <= foundLevel) {
                                i = index;
                            }
                        }
                    }
                });
                if (i === null) {
                    i = this.thread.length;
                }
                this.thread.splice(i, 0, forumPost);
            });
        }
    }

    arrayOf(size) {
        return Array(size);
    }
}
