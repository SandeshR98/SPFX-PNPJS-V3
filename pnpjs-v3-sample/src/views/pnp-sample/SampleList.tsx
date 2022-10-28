import * as React from 'react';
import { IListFormProps } from '../../webparts/listForm/components/IListFormProps';
import {
	ConstrainMode,
	DetailsList,
	DetailsListLayoutMode,
	IColumn,
	IDetailsHeaderProps,
	IRenderFunction,
	ITooltipHostProps,
	mergeStyleSets,
	ScrollablePane,
	ScrollbarVisibility,
	SelectionMode,
	Sticky,
	StickyPositionType,
	TooltipHost,
} from '@fluentui/react';
import styles from '../../webparts/listForm/components/ListForm.module.scss';
import { ISampleList, ISampleListState } from '../../models/ISampleListState';
import CommonService from '../../services/CommonService';
import { ListName } from '../../constants/Inventory';
import { Link } from '@fluentui/react';
import { UserGroups } from '../../constants/Security';

const classNames = mergeStyleSets({
	wrapper: {
		height: '500px',
		position: 'relative',
		marginTop: '10px',
	},
	filter: {
		paddingBottom: 20,
		maxWidth: 300,
	},
	header: {
		margin: 0,
	},
	row: {
		display: 'inline-block',
	},
	textRight: {
		textAlign: 'right',
	},
	textCenter: {
		textAlign: 'center',
	},
	countLabel: {
		fontSize: '12px',
		fontWeight: 400,
		color: '#666666',
		paddingLeft: '8px',
	},
	exportButton: {
		fontSize: '12px',
		fontWeight: 600,
		backgroundColor: '#cf2d27',
		border: '1px solid #CF2D27',
		color: '#ffffff',
		textDecoration: 'none',
		marginRight: '8px',
		paddingTop: '8px',
		paddingRight: '16px',
		paddingBottom: '8px',
		paddingLeft: '16px',
		float: 'right',
		fontFamily: 'Segoe UI',
	},
	searchText: {
		marginLeft: '8px',
	},
});

export default class SampleList extends React.Component<IListFormProps, ISampleListState> {
	private commonService: CommonService;
	private _columns: IColumn[];

	constructor(props: IListFormProps, state: ISampleListState) {
		super(props);

		this.commonService = new CommonService();
		this.state = {
			items: [],
		};

		// prettier-ignore
		this._columns = [
            { key: 'column1', name: 'Name', fieldName: 'Name', minWidth: 80, maxWidth: 80, isResizable: false },
            { key: 'column2', name: 'Age', fieldName: 'Age', minWidth: 60, maxWidth: 60, isResizable: false, isMultiline: true },
            { key: 'column3', name: 'Address', fieldName: 'Address', minWidth: 100, maxWidth: 100, isResizable: false, isMultiline: true },
            { key: 'column4', name: 'Date of Birth', fieldName: 'DateOfBirth', minWidth: 100, maxWidth: 100, isResizable: false },
            { key: 'column5', name: 'Gender', fieldName: 'Gender', minWidth: 60, maxWidth: 60, isResizable: false },
            { key: 'column6', name: 'Mobile No', fieldName: 'MobileNo', minWidth: 60, maxWidth: 60, isResizable: false },
            { key: 'column7', name: 'Action', fieldName: 'RecordViewUrl', minWidth: 80, maxWidth: 80, isResizable: false },
        ];

		this.getALLItems = this.getALLItems.bind(this);
		this.getListItems = this.getListItems.bind(this);
	}

	public async componentDidMount(): Promise<void> {
		// GET ALL LIST ITEMS
		await this.getALLItems();

		// GET SPECIFIC ITEMS
		await this.getListItems();

		// CHECK USER HAS GROUP (TRUE / FALSE)
		await this.getUserGroupPermissions();
	}

	private getALLItems = async (): Promise<void> => {
		const allItems = await this.commonService.getAll(ListName.PNPV3LIST);
		console.log(allItems);
	};

	private getListItems = async (): Promise<void> => {
		const { siteUrl } = this.props || {};
		const listItems = await this.commonService.getListItems(ListName.PNPV3LIST, siteUrl);
		this.setState({ items: listItems });
	};

	private getUserGroupPermissions = async (): Promise<void> => {
		const hasPermissions = await this.commonService.checkLoggedUserGroups(UserGroups.SampleGroup);
		console.log(hasPermissions);
	};

	public onRenderDetailsHeader(
		props: IDetailsHeaderProps,
		defaultRender?: IRenderFunction<IDetailsHeaderProps>
	): JSX.Element {
		return (
			<Sticky stickyPosition={StickyPositionType.Header} isScrollSynced={true}>
				{defaultRender &&
					defaultRender({
						...props,
						onRenderColumnHeaderTooltip: (tooltipHostProps: ITooltipHostProps) => (
							<TooltipHost {...tooltipHostProps} />
						),
					})}
			</Sticky>
		);
	}

	private _renderItemColumn(item: ISampleList, index: number, column: IColumn): JSX.Element {
		const fieldContent = item[column.fieldName as keyof ISampleList] as string;

		switch (column.key) {
			case 'column7':
				return (
					<Link href={item.RecordViewUrl} target='_blank'>
						View Record
					</Link>
				);

			default:
				return <span>{fieldContent}</span>;
		}
	}

	public render(): React.ReactElement<IListFormProps> {
		return (
			<div className={classNames.wrapper}>
				<div className={styles.grid}>
					<div className={styles.row}>
						<ScrollablePane scrollbarVisibility={ScrollbarVisibility.auto}>
							<DetailsList
								compact={true}
								items={this.state.items}
								columns={this._columns}
								onRenderItemColumn={this._renderItemColumn}
								setKey='set'
								layoutMode={DetailsListLayoutMode.fixedColumns}
								constrainMode={ConstrainMode.unconstrained}
								onRenderDetailsHeader={this.onRenderDetailsHeader}
								selectionMode={SelectionMode.none}
							/>
						</ScrollablePane>
					</div>
				</div>
			</div>
		);
	}
}
