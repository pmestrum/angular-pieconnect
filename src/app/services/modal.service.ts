import { Injectable } from '@angular/core';
import { PostSheetService } from './post-sheet.service';
import { MatDialog } from '@angular/material';
@@import { ToastrService } from 'ngx-toastr';
import { ForumDialogComponent, ForumDialogData } from '../components/forum-dialog.component';
import { EditDialogComponent, EditDialogData } from '../components/edit-dialog.component';
import { ProtoTerm, Term } from './model';

@Injectable()
export class ModalService {

    constructor(private postSheetService: PostSheetService, private dialog: MatDialog, private toastrService: ToastrService) {

    }

    openNewForumtopicDialog(data: ForumDialogData): void {
        const dialogRef = this.dialog.open(ForumDialogComponent, {
            width: '400px',
            data
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.postSheetService.postNewForumTopic(result.ptermId, result.termId, result.langId, result.lawId, result.user, result.title, result.post, null).then((resp: { result: string, row: number, uuid: string }) => {
                    this.toastrService.success('New forum topic is sent', null, { positionClass: 'toast-bottom-right' });
                }, error => {
                    this.toastrService.error('New forum topic is not sent', null, { positionClass: 'toast-bottom-right' });
                })
            }
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
