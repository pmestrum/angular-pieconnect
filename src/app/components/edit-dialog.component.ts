import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProtoTerm, Term } from '../services/model';

export interface EditDialogData {
    prototerm: ProtoTerm;
    term: Term;
    user: string;
    feedback?: string;
}

@Component({
    selector: 'edit-dialog',
    templateUrl: 'edit-dialog.component.html',
})
export class EditDialogComponent implements OnInit {

    editForm: FormGroup;

    constructor(public dialogRef: MatDialogRef<EditDialogComponent>, @Inject(MAT_DIALOG_DATA) private data: EditDialogData) {
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    ngOnInit(): void {
        this.editForm = new FormGroup({
            termId: new FormControl(this.data.term && this.data.term.TERM_ID),
            ptermId: new FormControl((this.data.prototerm && this.data.prototerm.PTERM_ID) || (this.data.term && this.data.term.PTERM_ID)),
            user: new FormControl('', Validators.required),
            edit: new FormControl('', Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(1000)])),
        });
    }

}
