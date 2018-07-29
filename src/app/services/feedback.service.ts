import { Injectable } from '@angular/core';
import { PostSheetService } from './post-sheet.service';
import { MatDialog } from '@angular/material';
import { FeedbackDialogComponent } from '../components/feedback-dialog.component';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class FeedbackService {

    constructor(private postSheetService: PostSheetService, private dialog: MatDialog, private toastrService: ToastrService) {

    }

    openDialog(termId: string, user: string): void {
        const dialogRef = this.dialog.open(FeedbackDialogComponent, {
            width: '250px',
            data: {termId, user}
        });

        dialogRef.afterClosed().subscribe(result => {
            this.postSheetService.postFeedback(null, null, null).then((resp: {result: string, row: number, uuid: string}) => {
                this.toastrService.success("Feedback is sent", null, {positionClass: 'toast-bottom-right'});
            }, error => {
                this.toastrService.error("Feedback is not sent", null, {positionClass: 'toast-bottom-right'});
            })
        });
    }

}
