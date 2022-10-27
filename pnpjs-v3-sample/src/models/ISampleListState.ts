export interface ISampleList {
    Name: string;
    Age: number;
    Address: string;
    DateOfBirth: Date;
    Gender: string;
    MobileNo: number;
}

export interface ISampleListState {
    items: ISampleListState[];
}