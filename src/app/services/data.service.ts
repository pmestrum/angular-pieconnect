import { Injectable } from '@angular/core';
import { Lang, Settings, Term } from './model';
import * as Tabletop from 'tabletop';
import { circle, geoJSON, icon, latLng, latLngBounds, Layer, marker, polygon, tileLayer } from 'leaflet';

// const Tabletop = require('tabletop');

export interface SheetData {
    termElements: Term[],
    settings: Settings,
    tabletop: any
}

@Injectable()
export class DataService {

    private _data$;

    get data$() {
        if (!this._data$){
            this.loadData$();
        }
        return this._data$;
    }

    private loadData$(): void {
        this._data$ = new Promise((resolve, reject) => {
            console.log('in loadData');
            Tabletop.init({
                key: 'https://docs.google.com/spreadsheets/d/1N_P4SpddLB-14wCst-2uzfjfgDq2qfN4rWxRGohxGGY/edit?usp=sharing',
                callback: (data, tabletop) => {
                    console.log(data);
                    console.log(tabletop);
                    const elements = this.normalizeData(data);
                    const termElements = Object.keys(elements.termElements).map(key => elements.termElements[key]);
                    resolve({ termElements, tabletop, settings: elements.settings });
                },
                simpleSheet: false,
                parseNumbers: true
            })
        });
    }

    private normalizeData(data) {
        const arrayToObjectReducer = (key) => (res, object) => {
            return {
                ...res,
                [object[key]]: object,
            }
        };
        const langElements = data.LANG.elements.reduce(arrayToObjectReducer('LANG_ID'), {});
        const lawElements = data.LAW.elements.reduce(arrayToObjectReducer('LAW_ID'), {});
        const ptermElements = data.PTERM.elements.reduce(arrayToObjectReducer('PTERM_ID'), {});
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
            if (term.PTERM_ID) {
                term.protoTerm = ptermElements[term.PTERM_ID];
                if (!term.protoTerm.terms) {
                    term.protoTerm.terms = [];
                }
                term.protoTerm.terms.push(term);
            }
        });

        const getSetting = (key) => data.SETTINGS.elements.find(el => el.KEY === key).VALUE;

        const settings: Settings = {
            showIds: getSetting('show-ids').toUpperCase() === 'TRUE',
            map: {
                lat: getSetting('map-center-lat'),
                lon: getSetting('map-center-lon'),
                zoom: getSetting('map-zoom'),
                disablePanZoom: getSetting('map-disable-pan-zoom').toUpperCase() === 'TRUE',
                zoomToMarkers: getSetting('zoom-to-markers').toUpperCase() === 'TRUE',
                bounds: {
                    minLat: null, minLong: null, maxLat: null, maxLong: null
                },
            }
        };
        Object.keys(langElements).map(key => langElements[key]).forEach((lang: Lang) => {
            try {
                lang.point = latLng(lang.LAT, lang.LONG);
            } catch (e) {
                // Ok, lat & lng are not numbers
            }
            if (lang.point) {
                const lat = lang.point.lat;
                const lng = lang.point.lng;

                settings.map.bounds.minLat = settings.map.bounds.minLat && Math.min(settings.map.bounds.minLat, lat) || lat;
                settings.map.bounds.minLong = settings.map.bounds.minLong && Math.min(settings.map.bounds.minLong, lng) || lng;
                settings.map.bounds.maxLat = settings.map.bounds.maxLat && Math.max(settings.map.bounds.maxLat, lat) || lat;
                settings.map.bounds.maxLong = settings.map.bounds.maxLong && Math.max(settings.map.bounds.maxLong, lng) || lng;
            }
        });

        console.log({ langElements, termElements, lawElements, settings });
        return { langElements, termElements, lawElements, settings };
    }
}
