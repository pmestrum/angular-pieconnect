
export interface Term {
    TERM_ID: number;
    INFO: string;
    FORM: string;
    ROMAN: string;
    LANG_ID: number;
    lang: Lang;
    laws: LawLink[];
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

export interface LawLink {
    law: Law;
    DISCUSS: string;
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

export interface ForumPost {
    UUID: string;
    PARENT_UUID: string;
    ROOT_UUID: string;
    TIMESTAMP: string;
    USER: string;
    TITLE: string;
    POST: string;
    PTERM_ID: number;
    TERM_ID: number;
    LANG_ID: number;
    LAW_ID: number;
    protoTerm?: ProtoTerm;
    term?: Term;
    lang?: Lang;
    law?: Law;
    children?: ForumPost[];
    level?: number;
}

export interface ForumPosts {
    prototerms: {prototerm: ProtoTerm, posts: ForumPost[]}[],
    terms: {term: Term, posts: ForumPost[]}[],
    langs: {lang: Lang, posts: ForumPost[]}[],
    laws: {law: Law, posts: ForumPost[]}[],
}
