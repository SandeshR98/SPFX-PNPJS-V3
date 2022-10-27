import * as React from 'react';
import styles from './CreateForm.module.scss';
import { ICreateFormProps } from './ICreateFormProps';
import SampleForm from '../../../views/pnp-sample/SampleForm';

export default class CreateForm extends React.Component<ICreateFormProps, {}> {
	public render(): React.ReactElement<ICreateFormProps> {
		const { siteUrl, context } = this.props;
		const queryParms = new URLSearchParams(window.location.search);
		const recordId = queryParms.get('record');

		return (
			<div className={styles.createForm}>
				<SampleForm siteUrl={siteUrl} context={context} recordId={recordId}/>
			</div>
		);
	}
}
