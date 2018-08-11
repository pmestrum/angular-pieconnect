import { Component } from '@angular/core';
import { DataService } from './services/data.service';
import { NgcCookieConsentService, NgcInitializeEvent, NgcStatusChangeEvent } from 'ngx-cookieconsent';
import { Subscription } from 'rxjs/Subscription';
import { LocalStorageService } from './services/local-storage.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})

export class AppComponent {
    activeLink = 'map';

    constructor(private dataService: DataService, private localStorageService: LocalStorageService) {
        dataService.data$.then(() => console.log('data loaded'));
    }

    ngOnInit() {
        const scope = this;
        window['cookieconsent'].initialise({
            type: 'opt-out',
            container: document.getElementById("content"),
            palette:{
                popup: {background: "#fff"},
                button: {background: "#aa0000"},
            },
            revokable:true,
            onStatusChange: function(status) {
                scope.localStorageService.setAcceptCookies(this.hasConsented());
            },
            law: {
                regionalLaw: false,
            },
            location: true,
        });
    }

    isSelected(route) {
        return this.activeLink === route;
    }
}
