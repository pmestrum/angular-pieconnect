import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Component, Inject, OnInit } from '@angular/core';
import { Lang, Law, ProtoTerm, Term } from '../services/model';
import { FormControl, FormGroup, Validators } from '@angular/forms';

export interface ForumDialogData {
    term: Term;
    prototerm: ProtoTerm;
    lang: Lang;
    law: Law;
    user: string;
}

@Component({
    selector: 'forum-dialog',
    templateUrl: 'forum-dialog.component.html',
})
export class ForumDialogComponent implements OnInit {

    newForumTopicForm: FormGroup;

    constructor(
        public dialogRef: MatDialogRef<ForumDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: ForumDialogData) {}

    onNoClick(): void {
        this.dialogRef.close();
    }

    ngOnInit(): void {
        this.newForumTopicForm = new FormGroup({
            termId: new FormControl(this.data.term && this.data.term.TERM_ID),
            ptermId: new FormControl(this.data.prototerm && this.data.prototerm.PTERM_ID),
            langId: new FormControl(this.data.lang && this.data.lang.LANG_ID),
            lawId: new FormControl(this.data.law && this.data.law.LAW_ID),
            user: new FormControl('', Validators.required),
            title: new FormControl('', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])),
            post: new FormControl('', Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(1000)])),
        });
    }

}
