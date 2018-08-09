import { Component } from '@angular/core';
import { DataService } from './services/data.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})

export class AppComponent {
    activeLink = 'map';

    constructor(private dataService: DataService) {
        dataService.data$.then( () => console.log('data loaded'));
    }

    isSelected(route) {
        return this.activeLink === route;
    }
}
