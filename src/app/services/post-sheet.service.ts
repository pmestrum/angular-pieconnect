import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class PostSheetService {

    constructor(private httpClient: HttpClient) {

    }

    getForumTopics(): Promise<any> {
        const data = {
            ACTION: 'GET-COMMENTS',
        };
        return this.send(data);
    }

    postNewForumTopic(ptermId, termId, langId, lawId, user, title, post, parentPostUuid): Promise<any> {
        const data = {
            ACTION: 'INSERT-ROW',
            SHEET_NAME: 'FORUM',
            PARENT_POST_UUID: parentPostUuid,
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
            EDIT:edit
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
