import * as React from 'react';
import { ICreateFormProps } from '../../webparts/createForm/components/ICreateFormProps';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { Stack, IStackProps, IStackStyles } from 'office-ui-fabric-react/lib/Stack';
import {
	DatePicker,
	getTheme,
	DefaultButton,
	IconButton,
	Label,
	mergeStyleSets,
	IIconProps,
} from 'office-ui-fabric-react';
import { Dropdown, IDropdownStyles, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { PrimaryButton } from 'office-ui-fabric-react';
import { ChoiceField, ListName } from '../../constants/Inventory';
import { ISampleFormState } from '../../models/ISampleFormState';
import CommonService from '../../services/CommonService';

const theme = getTheme();
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

const iconButtonStyles = {
	root: {
		color: theme.palette.neutralPrimary,
		marginLeft: 'auto',
		marginTop: '4px',
		marginRight: '2px',
	},
	rootHovered: {
		color: theme.palette.neutralDark,
	},
};

const uploadIcon: IIconProps = { iconName: 'CloudUpload' };
const removeIcon: IIconProps = { iconName: 'RemoveFilter' };

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
			SampleListId: null,
			SampleListVId: null,
			GenderChoices: [],
			files: null,
		};

		this.handleInputChange = this.handleInputChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleDelete = this.handleDelete.bind(this);
	}

	public async componentDidMount(): Promise<void> {
		// GET ITEM BY ID
		await this.getItem();

		// GET LIST ID BY LIST NAME
		await this.getListId();

		// GET CHOICE FIELD VALUES
		await this.getGenderChoices();
	}

	private getItem = async (): Promise<void> => {
		const { recordId } = this.props || {};

		try {
			if (!recordId) return;

			const listItem = await this.commonService.getListItemById(
				ListName.PNPV3LIST,
				Number(recordId)
			);
			const { DateOfBirth, ...state } = listItem;

			const dateofBirth = new Date(DateOfBirth.toString().split('T')[0]);
			this.setState({ ...state, DateOfBirth: dateofBirth });
		} catch (error) {
			// Display Error Message Here
		}
	};

	// USE THIS FOR LIST ITEM PICKERS
	private getListId = async (): Promise<void> => {
		try {
			const listsArray = [
				{ state: 'SampleListId', list: ListName.PNPV3LIST },
				{ state: 'SampleListVId', list: ListName.PNPLIST },
			];

			for (const item of listsArray) {
				const listId = await this.commonService.getListIdByListName(item.list);
				this.setState({ ...this.state, [item.state]: listId ?? null });
			}
		} catch (error) {
			// Display Error Message Here
		}
	};

	private getGenderChoices = async (): Promise<void> => {
		try {
			const choices = await this.commonService.getChoiceField(
				ListName.PNPV3LIST,
				ChoiceField.Gender
			);
			this.setState({ GenderChoices: choices });
		} catch (error) {
			// Display Error Message Here
		}
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

	private handleSubmit = async (): Promise<void> => {
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

	private handleDelete = async (): Promise<void> => {
		const { recordId } = this.props || {};

		try {
			await this.commonService.removeItem(ListName.PNPV3LIST, Number(recordId));
		} catch (error) {
			alert('errrr');
			console.log(error);
		}
	};

	private handleFileDialog = (): void => {
		(document.getElementById('sample-file-picker') as HTMLInputElement).value = '';
		document.getElementById('sample-file-picker').click();
	};

	private handleRemoveFile = (): void => {
		this.setState({ files: null });
	};

	private handleFilePicker = (event: React.ChangeEvent<HTMLInputElement>): void => {
		this.setState({ files: event.target.files });
		console.log(event.target.files);
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

					<div>
						<div>
							<input
								id='sample-file-picker'
								multiple
								type='file'
								name='File'
								style={{ display: 'none' }}
								onChange={(event) => this.handleFilePicker(event)}
							/>
						</div>
						<DefaultButton
							text='Upload Files'
							onClick={this.handleFileDialog}
							iconProps={uploadIcon}
						/>

						{this.state.files?.length > 0 && (
							<table>
								<tr>
									<td>
										<Label
											style={{
												fontSize: '12px',
												fontWeight: 400,
												color: '#666666',
											}}
										>
											{this.state.files?.length} Files available
										</Label>
									</td>
									<td id='fileRemoveButton'>
										<IconButton
											styles={iconButtonStyles}
											iconProps={removeIcon}
											onClick={this.handleRemoveFile}
										/>
									</td>
								</tr>
							</table>
						)}
					</div>
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
						options={this.state.GenderChoices}
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
							onClick={this.handleSubmit}
						/>

						{this.props.recordId && (
							<PrimaryButton
								text='Delete'
								style={{ width: '10px', float: 'right' }}
								onClick={this.handleDelete}
							/>
						)}
					</div>
				</Stack>
			</Stack>
		);
	}
}
