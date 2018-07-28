import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../services/data.service';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Lang, Settings, Term } from '../services/model';
import { circle, geoJSON, icon, divIcon, latLng, latLngBounds, Layer, marker, polygon, tileLayer, popup, point } from 'leaflet';

@Component({
    selector: 'app-map-page',
    templateUrl: './map-page.component.html',
    styleUrls: ['./map-page.component.css']
})

export class MapPageComponent implements OnInit {
    title = 'Pie Connect';
    termElements: Term[] = [];
    tabletop = null;

    displayedColumns = ['FORM', 'SEMANT'];
    dataSource: MatTableDataSource<any>;
    leafletOptions;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    @ViewChild('mapp') mapp: any;

    selected: Term;
    map;
    settings: Settings;
    markers: Layer[] = [];
    bounds;

    constructor(private dataService: DataService) {
    }

    ngOnInit() {
        console.log('in ngInit');
        this.dataService.data$.then(({ termElements, tabletop, settings }) => {
            this.termElements = termElements;
            this.tabletop = tabletop;
            this.settings = settings;
            if (this.settings.showIds) {
                this.displayedColumns = ['TERM_ID', 'FORM', 'SEMANT'];
            }
            this.dataSource = new MatTableDataSource(termElements);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;

            this.dataSource.filterPredicate = (data: Term, filter: string) => {
                return data.SEMANT.toLowerCase().indexOf(filter.toLowerCase()) >= 0 ||
                    data.FORM.toLowerCase().indexOf(filter.toLowerCase()) >= 0;
            };

            this.bounds = latLngBounds(latLng(settings.map.bounds.minLat, settings.map.bounds.minLong), latLng(settings.map.bounds.maxLat, settings.map.bounds.maxLong));
            this.leafletOptions = {
                layers: [
                    tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })
                ],
                zoom: settings.map.zoom,
                center: latLng((settings.map.bounds.maxLat + settings.map.bounds.minLat) / 2, (settings.map.bounds.maxLong + settings.map.bounds.minLong) / 2),
                zoomControl: !settings.map.disablePanZoom,
                // maxBounds: latLngBounds(latLng(settings.map.bounds.minLat, settings.map.bounds.minLong), latLng(settings.map.bounds.maxLat, settings.map.bounds.maxLong)),
            };
        });
    }

    /**
     * Set the paginator and sort after the view init since this component will
     * be able to query its view for the initialized paginator and sort.
     */
    ngAfterViewInit() {
    }

    selectRow(row: Term) {
        if (!this.selected || this.selected.protoTerm.PTERM_ID !== row.protoTerm.PTERM_ID) {
            this.selected = row;

            this.removeMarkers();
            row.protoTerm.terms.forEach(term => {
                this.addMarker(term);
            });

            if (this.settings.map.zoomToMarkers) {
                const minLat = Math.min(...row.protoTerm.terms.map((term: Term) => term.lang.LAT));
                const minLong = Math.min(...row.protoTerm.terms.map((term: Term) => term.lang.LONG));
                const maxLat = Math.max(...row.protoTerm.terms.map((term: Term) => term.lang.LAT));
                const maxLong = Math.max(...row.protoTerm.terms.map((term: Term) => term.lang.LONG));
                const bounds = latLngBounds(latLng(minLat, minLong), latLng(maxLat, maxLong));
                const newZoom = this.getMap().getBoundsZoom(bounds) - 0.1;

                const swPoint = this.getMap().project(bounds.getSouthWest(), newZoom);
                const nePoint = this.getMap().project(bounds.getNorthEast(), newZoom);
                const center = this.getMap().unproject(swPoint.add(nePoint).divideBy(2), newZoom);
                this.getMap().flyTo(center, newZoom);
            }
        }
    }

    getMap() {
        if (!this.map) {
            this.map = window['mymap'];
        }
        return this.map;
    }

    applyFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
        this.dataSource.filter = filterValue;
    }

    mapReady(map) {
        this.map = map;
        window['mymap'] = map;

        map.fitBounds(this.bounds);
        if (this.settings.map.disablePanZoom) {
            map.dragging.disable();
            map.touchZoom.disable();
            map.doubleClickZoom.disable();
            map.scrollWheelZoom.disable();
            map.boxZoom.disable();
            map.keyboard.disable();
            if (map.tap) map.tap.disable();
            // document.getElementById('map').style.cursor = 'default';
        }
    }

    mapReadyBind = this.mapReady.bind(this)

    private getMarkerMarkup(term: Term): string {
        let markup = '';
        markup = `<div class="language">${this.settings.showIds ? term.lang.LANG_ID + '-' : ''}${term.lang.NAME}</div>`;
        markup += `<div class="term">${this.settings.showIds ? term.TERM_ID + '-' : ''}${term.FORM}</div>`;
        return markup;

    }

    /**
     * Generate markup for the info overlay popup
     */
    getPopupMarkup(term: Term) {
        // word class, gender, meaning, link type, bibliographical references, comments
        let s, source, derivedMarkup = '', idx;
        let markup = '<h2>' + term.FORM + '</h2>';
        markup += '<table>';
        markup += '<tr><th>Lang</th><td>' + term.lang.NAME + '</td></tr>';
        markup += '<tr><th>Family</th><td>' + term.lang.FAMILY + '</td></tr>';
        if (term.lang.GLOTTO && term.lang.GLOTTO.toLowerCase().startsWith('http')) {
            markup += '<tr><th>Glotto</th><td><a href="' + term.lang.GLOTTO + '">link</a></td></tr>';
        } else {
            markup += '<tr><th>Glotto</th><td>' + term.lang.GLOTTO + '</td></tr>';
        }
        markup += '</table>';
        if (term.laws) {
            term.laws.forEach(law => {
                markup += '<h3>' + law.NAME + '</h3>';
                markup += law.DESCR + '<br />';
                // markup += '<a href="' + law.LINK + '">Link</a><p />';
                markup += '<b>Link:</b>' + law.LINK + '<p />';
            })
        }

        return markup;
    }

    private addMarker(term: Term) {
        const newMarker = marker(
            [term.lang.LAT, term.lang.LONG],
            {
                desc: this.getPopupMarkup(term),
                icon: divIcon({
                    className: 'word-marker',
                    html: this.getMarkerMarkup(term),
                })
            }
        );

        newMarker.bindPopup(this.getPopupMarkup(term));
        this.markers.push(newMarker);
    }

    private removeMarkers() {
        this.markers = [];
    }
}
