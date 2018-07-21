import { Component, OnInit } from "@angular/core";
import { DataService } from './data.service';
// import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
  title = "Pie Connect";
  data: any = {};
  tabletop = null;
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = null;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    console.log('in ngInit');
    this.dataService.loadData$().then(resp => {
      this.data = resp.data;
      this.tabletop = resp.tabletop;
      this.dataSource = new MatTableDataSource([]);
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
