import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataService } from './data.service';
import { ForumPost, ForumPosts, Lang, Law, ProtoTerm, Term } from './model';

@Injectable()
export class PostSheetService {

    constructor(private httpClient: HttpClient, private dataService: DataService) {

    }

    getForumTopics(): Promise<ForumPosts> {
        return new Promise((resolve, reject) => {
            const data = {
                ACTION: 'GET-FORUM-TOPICS',
            };
            return this.send(data).then(
                result => {
                    this.dataService.data$.then((data) => {
                        let topics = result.topics.map(this.replaceIdsWithObjects.bind(this, data));
                        resolve(this.convertToForumPosts(topics));
                    });
                },
                reject);
        });
    }

    getForumTopicThread(uuid: string): Promise<any> {
        return new Promise((resolve, reject) => {
        const data = {
            ACTION: 'GET-FORUM-TOPIC',
            UUID: uuid
        };
        return this.send(data).then(result => {
            this.dataService.data$.then((data) => {
                resolve(this.replaceIdsWithObjects(data, result.topic));
            });
        }, reject);
        });
    }

    postNewForumTopic(ptermId, termId, langId, lawId, user, title, post, parentPostUuid, rootUuid): Promise<any> {
        const data = {
            ACTION: 'INSERT-ROW',
            SHEET_NAME: 'FORUM',
            PARENT_UUID: parentPostUuid,
            ROOT_UUID: rootUuid,
            TERM_ID: termId,
            PTERM_ID: ptermId,
            LANG_ID: langId,
            LAW_ID: lawId,
            TITLE: title,
            USER: user,
            POST: post
        };
        return this.send(data);
    }

    postEdit(ptermId, termId, user, edit): Promise<any> {
        const data = {
            ACTION: 'INSERT-ROW',
            SHEET_NAME: 'EDITS',
            PTERM_ID: ptermId,
            TERM_ID: termId,
            USER: user,
            EDIT: edit
        };
        return this.send(data);
    }

    private send(data): Promise<any> {
        return new Promise((resolve, reject) => {
            let queryparams = this.jsonToQueryString(data);
            let url = 'https://script.google.com/macros/s/AKfycbz2zhygzbUnTpRC0efoitRcEYZ2JYz34YDGqzOfgnmOy0QT6B0/exec' + queryparams;
            if (url.length > 2000) {
                reject('Post data is too big.');
            } else {
                this.httpClient.get(
                    url,
                    {}
                ).subscribe((resp: { result: string, row: number, uuid: string }) => {
                    if (resp.result === 'success') {
                        resolve(resp);
                    } else {
                        reject(resp);
                    }
                })
            }
        });
    }

    private jsonToQueryString(json) {
        return '?' +
            Object.keys(json).map(function (key) {
                return encodeURIComponent(key) + '=' +
                    encodeURIComponent(json[key]);
            }).join('&');
    }

    private replaceIdsWithObjects(data: { termElements: Term[], ptermElements: ProtoTerm[], langElements: Lang[], lawElements: Law[] }, post: ForumPost) {
        if (post.LANG_ID) {
            post.lang = data.langElements.find(lang => lang.LANG_ID === post.LANG_ID);
        }
        if (post.TERM_ID) {
            post.term = data.termElements.find(lang => lang.TERM_ID === post.TERM_ID);
        }
        if (post.PTERM_ID) {
            post.protoTerm = data.ptermElements.find(lang => lang.PTERM_ID === post.PTERM_ID);
        }
        if (post.LAW_ID) {
            post.law = data.lawElements.find(lang => lang.LAW_ID === post.LAW_ID);
        }
        if (post.children) {
            post.children.forEach(child => this.replaceIdsWithObjects(data, child));
        }
        post.timestamp = new Date(post.TIMESTAMP);
        return post;
    }

    private convertToForumPosts(posts: ForumPost[]) {
        const result: ForumPosts = {
          prototerms: [],
          terms: [],
          langs: [],
          laws: []
        };
        posts.forEach(post => {
            if (post.protoTerm) {
                let existing = result.prototerms.find(el => el.prototerm.PTERM_ID === post.protoTerm.PTERM_ID);
                if (!existing) {
                    existing = {prototerm: post.protoTerm, posts: []};
                    result.prototerms.push(existing);
                }
                existing.posts.push(post);
            }
            if (post.term) {
                let existing = result.terms.find(el => el.term.TERM_ID === post.term.TERM_ID);
                if (!existing) {
                    existing = {term: post.term, posts: []};
                    result.terms.push(existing);
                }
                existing.posts.push(post);
            }
            if (post.lang) {
                let existing = result.langs.find(el => el.lang.LANG_ID === post.lang.LANG_ID);
                if (!existing) {
                    existing = {lang: post.lang, posts: []};
                    result.langs.push(existing);
                }
                existing.posts.push(post);
            }
            if (post.law) {
                let existing = result.laws.find(el => el.law.LAW_ID === post.law.LAW_ID);
                if (!existing) {
                    existing = {law: post.law, posts: []};
                    result.laws.push(existing);
                }
                existing.posts.push(post);
            }
        });
        return result;
    }
}

// https://script.google.com/macros/s/AKfycbz2zhygzbUnTpRC0efoitRcEYZ2JYz34YDGqzOfgnmOy0QT6B0/exec
