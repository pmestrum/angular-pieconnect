import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from './data.service';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Lang, Law, Term } from './model';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
    title = 'Pie Connect';
    termElements: Term[] = [];
    tabletop = null;

    displayedColumns = ['TERM_ID', 'INFO', 'SEMANT'];
    dataSource: MatTableDataSource<any>;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    selection = new SelectionModel<Term>(false, []);


    constructor(private dataService: DataService) {
    }

    ngOnInit() {
        console.log('in ngInit');
        this.dataService.loadData$().then(({termElements, tabletop}) => {
            this.termElements = termElements;
            this.tabletop = tabletop;
            this.dataSource = new MatTableDataSource(termElements);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
        });
    }

    /**
     * Set the paginator and sort after the view init since this component will
     * be able to query its view for the initialized paginator and sort.
     */
    ngAfterViewInit() {
    }

    applyFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
        this.dataSource.filter = filterValue;
    }
}
