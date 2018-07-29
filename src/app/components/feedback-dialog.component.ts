import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Component, Inject } from '@angular/core';

export interface DialogData {
    termId: string;
    user: string;
    feedback?: string;
}

@Component({
    selector: 'feedback-dialog',
    templateUrl: 'feedback-dialog.component.html',
})
export class FeedbackDialogComponent {

    constructor(
        public dialogRef: MatDialogRef<FeedbackDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

    onNoClick(): void {
        this.dialogRef.close();
    }

}
