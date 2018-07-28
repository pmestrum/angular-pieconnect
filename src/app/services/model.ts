
export interface Term {
    TERM_ID: number;
    INFO: string;
    FORM: string;
    LANG_ID: number;
    lang: Lang;
    laws: Law[];
    protoTerm?: ProtoTerm;
    PTERM_ID: number;
    SEMANT: string;
}

export interface ProtoTerm {
    PTERM_ID: number;
    FORM: string;
    SEMANT: string;
    terms?: Term[]
}

export interface Lang {
    FAMILY: string;
    GLOTTO: string;
    LANG_ID: number
    LAT: number;
    LONG: number;
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
    showIds: boolean;
    map: {
        lat: number;
        lon: number;
        zoom: number;
        disablePanZoom: boolean;
        zoomToMarkers: boolean;
        bounds: {
            minLat: number;
            minLong: number;
            maxLat: number;
            maxLong: number;
        }

    }
}
