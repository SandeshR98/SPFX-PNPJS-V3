import * as React from 'react';
import styles from './CreateForm.module.scss';
import { ICreateFormProps } from './ICreateFormProps';
import SampleForm from '../../../views/pnp-sample/SampleForm';

export default class CreateForm extends React.Component<ICreateFormProps, {}> {
  public render(): React.ReactElement<ICreateFormProps> {
    const { siteUrl, context } = this.props;


    return (
      <div className={styles.createForm}>
        <SampleForm
          siteUrl={siteUrl}
          context={context}
        />
      </div>
    );
  }
}
