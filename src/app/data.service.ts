import {Injectable} from '@angular/core';
const Tabletop = require('tabletop');

@Injectable()
export class DataService {

  loadData$(): Promise<any> {
    console.log('in loadData$');
    return new Promise((resolve, reject) => {
      console.log('in loadData');
      Tabletop.init({
        key: 'https://docs.google.com/spreadsheets/d/1N_P4SpddLB-14wCst-2uzfjfgDq2qfN4rWxRGohxGGY/edit?usp=sharing',
        callback: function (data, tabletop) {
          console.log(data);
          console.log(tabletop);
          resolve({data, tabletop});
        },
        simpleSheet: false,
        parseNumbers: true
      })
    });
  }
}