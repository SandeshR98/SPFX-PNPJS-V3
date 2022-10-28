import { IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';

export interface ISampleFormState {
	Name: string;
	Age: number;
	Address: string;
	DateOfBirth: Date;
	Gender: string;
	MobileNo: number;
	SampleListId: string;
	SampleListVId: string;
	GenderChoices: IDropdownOption[];
}
