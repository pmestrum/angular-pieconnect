
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
    LAT; string;
    LONG: string;
    NAME: string;
    TEMP: string;
}

export interface Law {
    DESCR: string;
    LAW_ID: number;
    LINK: string;
    NAME: string;
}
