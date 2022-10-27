export interface ISampleList {
    Name: string;
    Age: number;
    Address: string;
    DateOfBirth: Date;
    Gender: string;
    MobileNo: number;
    RecordViewUrl: string;
}

export interface ISampleListState {
    items: ISampleList[];
}