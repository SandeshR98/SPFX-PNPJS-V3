import * as React from 'react';
import { ICreateFormProps } from '../../webparts/createForm/components/ICreateFormProps';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { Stack, IStackProps, IStackStyles } from 'office-ui-fabric-react/lib/Stack';
import { DatePicker, mergeStyleSets } from 'office-ui-fabric-react';
import {
	Dropdown,
	DropdownMenuItemType,
	IDropdownStyles,
	IDropdownOption,
} from 'office-ui-fabric-react/lib/Dropdown';
import { PrimaryButton } from 'office-ui-fabric-react';
import { ListName } from '../../constants/Inventory';
import { ISampleFormState } from '../../models/ISampleFormState';
import CommonService from '../../services/CommonService';

const stackTokens = { childrenGap: 50 };
const stackStyles: Partial<IStackStyles> = { root: { width: 650 } };
const columnProps: Partial<IStackProps> = {
	tokens: { childrenGap: 15 },
	styles: { root: { width: 300 } },
};

const controlClass = mergeStyleSets({
	control: {
		margin: '0 0 15px 0',
		maxWidth: '300px',
	},
});

const dropdownStyles: Partial<IDropdownStyles> = {
	dropdown: { width: 300 },
};

const options: IDropdownOption[] = [
	{
		key: 'genderHeader',
		text: 'Gender',
		itemType: DropdownMenuItemType.Header,
	},
	{ key: 'M', text: 'Male' },
	{ key: 'F', text: 'Female' },
	{ key: 'O', text: 'Other' },
];
export default class SampleForm extends React.Component<ICreateFormProps, ISampleFormState> {
	private commonService: CommonService;

	constructor(props: ICreateFormProps) {
		super(props);
		this.commonService = new CommonService();
		this.state = {
			Name: undefined,
			Age: null,
			Address: undefined,
			DateOfBirth: undefined,
			Gender: null,
			MobileNo: null,
		};

		this.handleInputChange = this.handleInputChange.bind(this);
		this.createRecord = this.createRecord.bind(this);
		this.getItem = this.getItem.bind(this);
	}

	public componentDidMount(): void {
		// GET ITEM BY ID
		this.getItem();
	}

	private getItem = async () => {
		const { recordId } = this.props || {};
		const listItem = await this.commonService.getListItemById(ListName.PNPV3LIST, Number(recordId));
		const { DateOfBirth, ...state } = listItem;
		const dateofBirth = new Date(DateOfBirth.toString().split('T')[0]);

		this.setState({ ...state, DateOfBirth: dateofBirth });
	};

	private handleInputChange = (
		event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	): void => {
		this.setState({
			...this.state,
			[event.target.name]: event.target.value,
		});
	};

	private onSelectDate = (date: Date | null | undefined): void => {
		this.setState({ DateOfBirth: date });
	};

	private onSelectDropdown = (
		event: React.FormEvent<HTMLDivElement>,
		item: IDropdownOption
	): void => {
		const selectedGender = item.key.toString();
		this.setState({ Gender: selectedGender });
	};

	private createRecord = async () => {
		const { recordId } = this.props || {};

		try {
			const data = {
				Name: this.state.Name,
				Age: this.state.Age,
				Address: this.state.Address,
				DateOfBirth: this.state.DateOfBirth,
				Gender: this.state.Gender,
				MobileNo: this.state.MobileNo,
			};

			if (recordId) {
				await this.commonService.updateItem(ListName.PNPV3LIST, Number(recordId), data);
				return;
			}
			await this.commonService.createItem(ListName.PNPV3LIST, data);
		} catch (error) {
			alert('errrr');
			console.log(error);
		}
	};

	public render(): React.ReactElement<ICreateFormProps> {
		return (
			<Stack horizontal tokens={stackTokens} styles={stackStyles}>
				<Stack {...columnProps}>
					<TextField
						label='Name'
						name='Name'
						value={this.state.Name}
						onChange={this.handleInputChange}
					/>
					<TextField
						label='Age'
						name='Age'
						value={String(this.state.Age)}
						type='Number'
						onChange={this.handleInputChange}
					/>
					<DatePicker
						label='Date of Birth'
						className={controlClass.control}
						placeholder='Select a date...'
						ariaLabel='Select a date'
						value={this.state.DateOfBirth}
						onSelectDate={this.onSelectDate}
					/>
				</Stack>
				<Stack {...columnProps}>
					<TextField
						label='Address'
						name='Address'
						value={this.state.Address}
						onChange={this.handleInputChange}
					/>
					<Dropdown
						placeholder='Select an option'
						label='Gender'
						options={options}
						styles={dropdownStyles}
						selectedKey={this.state.Gender}
						onChange={this.onSelectDropdown}
					/>
					<TextField
						label='Mobile No.'
						type='number'
						name='MobileNo'
						value={String(this.state.MobileNo)}
						onChange={this.handleInputChange}
					/>
					<br />
					<div>
						<PrimaryButton
							text={this.props.recordId ? 'Update' : 'Save'}
							style={{ width: '10px', float: 'right' }}
							onClick={this.createRecord}
						/>
					</div>
				</Stack>
			</Stack>
		);
	}
}
