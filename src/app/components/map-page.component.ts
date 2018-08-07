import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../services/data.service';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Lang, Law, ProtoTerm, Settings, Term } from '../services/model';
import { circle, geoJSON, icon, divIcon, latLng, latLngBounds, Layer, marker, polygon, tileLayer, popup, point } from 'leaflet';
import { ModalService } from '../services/modal.service';

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

    constructor(private dataService: DataService, private modalService: ModalService) {
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
                    // tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })
                    tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png', {subdomains: 'abcd',  maxZoom: 19, attribution: '...'})
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

    editClicked(prototerm: ProtoTerm, term: Term) {
        this.modalService.openEditDialog({term, prototerm, user: null});
    }

    newForumTopicClicked(prototerm: ProtoTerm, term: Term, lang: Lang, law: Law) {
        this.modalService.openNewForumtopicDialog({term, prototerm, lang, law, user: null, level: 0});
    }

    getPopupMarkupHtml(term: Term) {
        let ce = document.createElement.bind(document);
        let ct = document.createTextNode.bind(document);
        const createIconButton = (icon, onClick) => {
            const button = ce('i');
            button.setAttribute('class', 'material-icons');
            button.appendChild(ct(icon));
            button.addEventListener('click', onClick);
            return button;
        };
        const createIconButtons = (cbEdit, cbComment) => {
            const buttonCell = ce('th');
            buttonCell.setAttribute('class', 'popup icon-buttons noselect');
            if (cbComment) {
                let iconButton = createIconButton('insert_comment', cbComment);
                iconButton.setAttribute('class', iconButton.getAttribute('class') + ' comment');
                buttonCell.appendChild(iconButton);
            }
            if (cbEdit) {
                let iconButton = createIconButton('edit', cbEdit);
                iconButton.setAttribute('class', iconButton.getAttribute('class') + ' edit');
                buttonCell.appendChild(iconButton);
            }
            return buttonCell;
        };

        const div = ce('div');

        const table = div.appendChild(ce('table'));
        let row = table.appendChild(ce('tr'));
        row.appendChild(createIconButtons(this.editClicked.bind(this, null, term), this.newForumTopicClicked.bind(this, null, term, null, null)));
        row.appendChild(ce('h2')).appendChild(ct(term.FORM));
        row = table.appendChild(ce('tr'));
        row.appendChild(ce('th'));
        row.appendChild(ce('th')).appendChild(ct('Semant'));
        row.appendChild(ce('td')).appendChild(ct('"' + term.SEMANT + '"'));
        row = table.appendChild(ce('tr'));
        row.appendChild(createIconButtons(null, this.newForumTopicClicked.bind(this, null, null, term.lang, null)));
        row.appendChild(ce('th')).appendChild(ct('Lang'));
        row.appendChild(ce('td')).appendChild(ct(term.lang.NAME));
        row = table.appendChild(ce('tr'));
        row.appendChild(ce('th'));
        row.appendChild(ce('th')).appendChild(ct('Family'));
        row.appendChild(ce('td')).appendChild(ct(term.lang.FAMILY));
        row = table.appendChild(ce('tr'));
        row.appendChild(ce('th'));
        row.appendChild(ce('th')).appendChild(ct('Glotto'));
        if (term.lang.GLOTTO && term.lang.GLOTTO.toLowerCase().startsWith('http')) {
            const link = ce('a');
            link.setAttribute('href', term.lang.GLOTTO);
            row.appendChild(ce('td')).appendChild(link).appendChild(ct('link'));
        } else {
            row.appendChild(ce('td')).appendChild(ct(term.lang.GLOTTO));
        }

        if (term.laws) {
            term.laws.forEach(lawLink => {
                row = table.appendChild(ce('tr'));
                row.appendChild(createIconButtons(null, this.newForumTopicClicked.bind(this, null, null, null, lawLink.law)));
                let cell = row.appendChild(ce('td'));
                cell.setAttribute('colspan', '2');
                cell.appendChild(ce('h3')).appendChild(ct(lawLink.law.NAME));
                row.appendChild(cell);
                row = table.appendChild(ce('tr'));
                row.appendChild(ce('td'));
                cell = row.appendChild(ce('td'));
                cell.setAttribute('colspan', '2');
                cell.appendChild(ct(lawLink.DISCUSS));
                cell.appendChild(ce('br'));
                cell.appendChild(ct(lawLink.law.DESCR));
                cell.appendChild(ce('br'));
                let line = cell.appendChild(ce('p'));
                line.appendChild(ce('b').appendChild(ct('references: ')));
                line.appendChild(ct(lawLink.law.LINK));
            })
        }


        return div;
    }

    private addMarker(term: Term) {
        const newMarker = marker(
            [term.lang.LAT, term.lang.LONG],
            {
                // desc: this.getPopupMarkup(term),
                icon: divIcon({
                    className: 'word-marker',
                    html: this.getMarkerMarkup(term),
                })
            }
        );

        newMarker.bindPopup(this.getPopupMarkupHtml(term));
        this.markers.push(newMarker);
    }

    private removeMarkers() {
        this.markers = [];
    }

    clearSelection() {
        this.selected = null;
        this.markers = [];
    }
    editPterm() {
        this.editClicked(this.selected.protoTerm, null);
    }
    commentPterm() {
       this.newForumTopicClicked(this.selected.protoTerm, null, null, null);
    }
}
