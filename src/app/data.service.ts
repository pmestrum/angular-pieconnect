import { Injectable } from '@angular/core';
import { Term } from './model';

const Tabletop = require('tabletop');

@Injectable()
export class DataService {

    loadData$(): Promise<{ termElements: Term[], tabletop: any }> {
        console.log('in loadData$');
        return new Promise((resolve, reject) => {
            console.log('in loadData');
            Tabletop.init({
                key: 'https://docs.google.com/spreadsheets/d/1N_P4SpddLB-14wCst-2uzfjfgDq2qfN4rWxRGohxGGY/edit?usp=sharing',
                callback: (data, tabletop) => {
                    console.log(data);
                    console.log(tabletop);
                    const elements = this.normalizeData(data);
                    const termElements = Object.keys(elements.termElements).map(key => elements.termElements[key]);
                    resolve({ termElements, tabletop });
                },
                simpleSheet: false,
                parseNumbers: true
            })
        });
    }

    private normalizeData(data) {
        const arrayToObjectReducer = (key) => (res, lang) => {
            return {
                ...res,
                [lang[key]]: lang,
            }
        };
        const langElements = data.LANG.elements.reduce(arrayToObjectReducer('LANG_ID'), {});
        const lawElements = data.LAW.elements.reduce(arrayToObjectReducer('LAW_ID'), {});
        const termElements = data.TERM.elements.reduce(arrayToObjectReducer('TERM_ID'), {});
        Object.keys(termElements).forEach(termId => {
            const term = termElements[termId] as Term;
            term.lang = langElements[term.LANG_ID];
            // if (!term.lang.terms) {
            //     term.lang.terms = [];
            // }
            // term.lang.terms.push(term);
            term.laws = data.LAWAPP.elements.filter(link => link.TERM_ID === term.TERM_ID).map(link => {
                // const lawElement = lawElements[link.LAW_ID];
                // if (!lawElement.terms) {
                //     lawElement.terms = [];
                // }
                // lawElement.terms.push(term);
                return lawElements[link.LAW_ID];
            });
            if (term.PTERM_ID && termElements[term.PTERM_ID] && term.TERM_ID !== term.PTERM_ID) {
                term.parentTerm = termElements[term.PTERM_ID];
            }
        });

        console.log({ langElements, termElements, lawElements });
        return { langElements, termElements, lawElements };
    }
}
