import { Component, OnInit } from "@angular/core";
import { DataService } from './data.service';

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
  title = "Openpie";
  data: any = {};
  tabletop = null;
  
  constructor(private dataService: DataService) {}

  ngOnInit() {
    console.log('in ngInit');
    this.dataService.loadData$().then(resp => {
      this.data = resp.data;
      this.tabletop = resp.tabletop;
    });
  }
}
