import * as React from 'react';
import { IListFormProps } from '../../webparts/listForm/components/IListFormProps';

export default class SampleList extends React.Component<IListFormProps, {}> {

    public render(): React.ReactElement<IListFormProps> {
        return (
            <><h1>List Form Hiii</h1></>
        );
    }
}