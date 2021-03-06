export interface CallLog {
    number: string;
    type: number;
    date: number;
    duration: number;
    name: string;
    label: string;
    date_str : string;
}

export interface CallEvent {
    number: string;
    date: number;
    isRinging: boolean;
}