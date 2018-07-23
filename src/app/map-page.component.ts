import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from './data.service';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Settings, Term } from './model';
import { circle, geoJSON, icon, latLng, latLngBounds, Layer, marker, polygon, tileLayer } from 'leaflet';

@Component({
    selector: 'app-map-page',
    templateUrl: './map-page.component.html',
    styleUrls: ['./map-page.component.css']
})

export class MapPageComponent implements OnInit {
    title = 'Pie Connect';
    termElements: Term[] = [];
    tabletop = null;

    displayedColumns = ['TERM_ID', 'FORM', 'SEMANT', 'COORD'];
    dataSource: MatTableDataSource<any>;
    leafletOptions;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    selected: Term;
    map;
    private settings: Settings;
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
            this.dataSource = new MatTableDataSource(termElements);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;

            this.dataSource.filterPredicate = (data: Term, filter: string) => {
                debugger;
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
        this.selected = row;
        this.removeMarkers();
        if (row.lang.LAT && row.lang.LONG) {
            this.addMarker(row.lang.LAT, row.lang.LONG);
        }
    }

    applyFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
        this.dataSource.filter = filterValue;
    }

    mapReady(map) {
        this.map = map;

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

    private addMarker(lat, lon) {
        const newMarker = marker(
            [lat, lon],
            {
                icon: icon({
                    iconSize: [25, 41],
                    iconAnchor: [13, 41],
                    iconUrl: 'assets/marker-icon.png',
                    shadowUrl: 'assets/marker-shadow.png'
                })
            }
        );

        this.markers.push(newMarker);
    }

    private removeMarkers() {
        this.markers = [];
    }
}
