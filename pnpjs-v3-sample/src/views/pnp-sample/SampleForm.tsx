import * as React from 'react';
import { ICreateFormProps } from '../../webparts/createForm/components/ICreateFormProps';

export default class SampleForm extends React.Component<ICreateFormProps, {}> {

    public render(): React.ReactElement<ICreateFormProps> {
        return (
            <><h1>Create Form Hiii</h1></>
        );
    }
}