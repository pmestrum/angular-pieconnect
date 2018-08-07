import { Injectable } from '@angular/core';
import { PostSheetService } from './post-sheet.service';
import { MatDialog } from '@angular/material';
import { ForumDialogComponent, ForumDialogData } from '../components/forum-dialog.component';
import { EditDialogComponent, EditDialogData } from '../components/edit-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { ForumPost, Lang, Law, ProtoTerm, Term } from './model';

@Injectable()
export class ModalService {

    constructor(private postSheetService: PostSheetService, private dialog: MatDialog, private toastrService: ToastrService) {

    }

    openNewForumtopicDialog(data: ForumDialogData): Promise<ForumPost> {
        return new Promise((resolve, reject) => {
            const dialogRef = this.dialog.open(ForumDialogComponent, {
                width: '400px',
                data
            });

            dialogRef.afterClosed().subscribe((result) => {
                if (result) {
                    this.postSheetService.postNewForumTopic(result.ptermId, result.termId, result.langId, result.lawId, result.user, result.title, result.post, data.parentUuid, data.rootUuid).then((resp: { result: string, row: number, uuid: string, timestamp: string }) => {
                        this.toastrService.success('New forum topic is sent', null, { positionClass: 'toast-bottom-right' });
                        resolve({
                            UUID: resp.uuid,
                            PARENT_UUID: data.parentUuid,
                            ROOT_UUID: data.rootUuid,
                            TIMESTAMP: resp.timestamp,
                            USER: result.user,
                            TITLE: result.title,
                            POST: result.post,
                            PTERM_ID: data.prototerm && data.prototerm.PTERM_ID || null,
                            TERM_ID: data.term && data.term.TERM_ID || null,
                            LANG_ID: data.lang && data.lang.LANG_ID || null,
                            LAW_ID: data.law && data.law.LAW_ID || null,
                            protoTerm: data.prototerm,
                            term: data.term,
                            lang: data.lang,
                            law: data.law,
                            children: [],
                            level: data.level + 1,
                        })
                        ;
                    }, error => {
                        this.toastrService.error('New forum topic is not sent', null, { positionClass: 'toast-bottom-right' });
                        reject(error);
                    })
                }
            });
        });
    }

    openEditDialog(data: EditDialogData): void {
        const dialogRef = this.dialog.open(EditDialogComponent, {
            width: '400px',
            data
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.postSheetService.postEdit(result.ptermId, result.termId, result.user, result.edit).then((resp: { result: string, row: number, uuid: string }) => {
                    this.toastrService.success('Edit is sent', null, { positionClass: 'toast-bottom-right' });
                }, error => {
                    this.toastrService.error('Edit is not sent', null, { positionClass: 'toast-bottom-right' });
                })
            }
        });
    }

}
