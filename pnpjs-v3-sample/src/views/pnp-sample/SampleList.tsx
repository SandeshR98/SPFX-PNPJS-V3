import * as React from 'react';
import { IListFormProps } from '../../webparts/listForm/components/IListFormProps';
import { ConstrainMode, DetailsList, DetailsListLayoutMode, IColumn, IDetailsHeaderProps, IRenderFunction, ITooltipHostProps, Label, Link, mergeStyleSets, ScrollablePane, ScrollbarVisibility, SelectionMode, Sticky, StickyPositionType, TextField, TooltipHost } from 'office-ui-fabric-react';
import styles from '../../webparts/listForm/components/ListForm.module.scss';
import { ListName } from '../../constants/Inventory';
import { ISampleList, ISampleListState } from '../../models/ISampleListState';


const classNames = mergeStyleSets({
    wrapper: {
        height: '500px',
        position: 'relative',
        marginTop: '10px'
    },
    filter: {
        paddingBottom: 20,
        maxWidth: 300
    },
    header: {
        margin: 0
    },
    row: {
        display: 'inline-block'
    },
    textRight: {
        textAlign: 'right'
    },
    textCenter: {
        textAlign: 'center'
    },
    countLabel: {
        fontSize: '12px',
        fontWeight: 400,
        color: '#666666',
        paddingLeft: '8px'
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
        fontFamily: 'Segoe UI'
    },
    searchText: {
        marginLeft: '8px'
    }
});


export default class SampleList extends React.Component<IListFormProps, ISampleListState> {
    private _columns: IColumn[];
    private _allItems: ISampleList[];

    constructor(props: IListFormProps, state: ISampleListState) {
        super(props);
        this.state = ({
            items: [],
        });

        this._columns = [
            { key: 'column1', name: 'Contract ID', fieldName: 'ContractID', minWidth: 80, maxWidth: 80, isResizable: false },
            { key: 'column2', name: 'Rate Matrix Name', fieldName: 'RateMatrixName', minWidth: 200, maxWidth: 250, isResizable: false, isMultiline: true },
            { key: 'column3', name: 'Vendor', fieldName: 'Vendor', minWidth: 150, maxWidth: 200, isResizable: false, isMultiline: true },
            { key: 'column4', name: 'Start Date', fieldName: 'StartDate', minWidth: 100, maxWidth: 100, isResizable: false },
            { key: 'column5', name: 'End Date', fieldName: 'EndDate', minWidth: 100, maxWidth: 100, isResizable: false },
            { key: 'column6', name: 'Rate', fieldName: 'Rate', minWidth: 60, maxWidth: 60, isResizable: false },
            { key: 'column7', name: 'Action', fieldName: 'RecordViewUrl', minWidth: 80, maxWidth: 80, isResizable: false },
        ];
    }


    public onRenderDetailsHeader(props: IDetailsHeaderProps, defaultRender?: IRenderFunction<IDetailsHeaderProps>): JSX.Element {
        return (
            <Sticky stickyPosition={StickyPositionType.Header} isScrollSynced={true} >
                {
                    defaultRender!({
                        ...props,
                        onRenderColumnHeaderTooltip: (tooltipHostProps: ITooltipHostProps) => <TooltipHost {...tooltipHostProps} />
                    })}
            </Sticky >
        );
    }

    public render(): React.ReactElement<IListFormProps> {
        return (

            <div className={classNames.wrapper}>
                <div className={styles.grid}>
                    <div className={styles.row}>
                        <ScrollablePane scrollbarVisibility={ScrollbarVisibility.auto}>
                            <DetailsList
                                compact={true}
                                items={[]}
                                columns={this._columns}
                                // onRenderItemColumn={this._renderItemColumn}
                                setKey="set"
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