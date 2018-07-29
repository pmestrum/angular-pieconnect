import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class PostSheetService {

    constructor(private httpClient: HttpClient) {

    }

    getForumData(): Promise<any> {
        const data = {
            ACTION: 'GET-FORUM',
        };
        return this.send(data);
    }

    postFeedback(termId, user, feedback): Promise<any> {
        const data = {
            ACTION: 'INSERT-ROW',
            SHEET_NAME: 'FEEDBACK',
            TERM_ID: termId,
            USER: user,
            TIMESTAMP:true,
            FEEDBACK:feedback
        };
        return this.send(data);
    }

    postToForum(termId, parentPostId, user, post): Promise<any> {
        const data = {
            ACTION: 'INSERT-ROW',
            SHEET_NAME: 'FORUM-DATA',
            TERM_ID: termId,
            PARENT_POST_ID: parentPostId,
            USER: user,
            TIMESTAMP:true,
            POST:post
        };
        return this.send(data);
    }

    private send(data): Promise<any> {
        return new Promise((resolve, reject) => {
            let queryparams = this.jsonToQueryString(data);
            let url = 'https://script.google.com/macros/s/AKfycbz2zhygzbUnTpRC0efoitRcEYZ2JYz34YDGqzOfgnmOy0QT6B0/exec' + queryparams;
            if (url.length > 2000) {
                reject("Post data is too big.");
            } else {
                this.httpClient.get(
                    url,
                    {}
                ).subscribe((resp: {result: string, row: number, uuid: string}) => {
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
            Object.keys(json).map(function(key) {
                return encodeURIComponent(key) + '=' +
                    encodeURIComponent(json[key]);
            }).join('&');
    }
}
// https://script.google.com/macros/s/AKfycbz2zhygzbUnTpRC0efoitRcEYZ2JYz34YDGqzOfgnmOy0QT6B0/exec
