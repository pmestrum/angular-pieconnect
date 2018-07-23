
export interface Term {
    TERM_ID: number;
    INFO: string;
    LANG_ID: number;
    lang: Lang;
    laws: Law[];
    parentTerm?: Term;
    PTERM_ID: number;
    SEMANT: string;
}

export interface Lang {
    FAMILY: string;
    GLOTTO: string;
    LANG_ID: number
    LAT: string;
    LONG: string;
    NAME: string;
    TEMP: string;
    point: {lat: number, lng: number, alt?: number};
}

export interface Law {
    DESCR: string;
    LAW_ID: number;
    LINK: string;
    NAME: string;
}

export interface Settings {
    map: {
        lat: number;
        lon: number;
        zoom: number;
        disablePanZoom: boolean;
        bounds: {
            minLat: number;
            minLong: number;
            maxLat: number;
            maxLong: number;
        }

    }
}
