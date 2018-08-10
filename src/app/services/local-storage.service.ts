import { Injectable } from '@angular/core';

@Injectable()
export class LocalStorageService {

    private _acceptCookies: boolean = false;

    constructor() {
        this._acceptCookies = localStorage.getItem("acceptCookies") === 'true';
    }

    getUser(): string {
        return this._acceptCookies ? localStorage.getItem('user') : '';
    }

    setUser(user: string) {
        if (this._acceptCookies) {
            localStorage.setItem('acceptCookies', 'true');
            localStorage.setItem('user', user);
        }
    }

    acceptCookies(): boolean {
        return this._acceptCookies;
    }
    setAcceptCookies(acceptCookies: boolean) {
        this._acceptCookies = acceptCookies;
    }


}
