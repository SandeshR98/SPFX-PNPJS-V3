import * as React from 'react';
import styles from './ListForm.module.scss';
import { IListFormProps } from './IListFormProps';
import SampleList from '../../../views/pnp-sample/SampleList';

export default class ListForm extends React.Component<IListFormProps, {}> {
  public render(): React.ReactElement<IListFormProps> {
    const { siteUrl, context } = this.props;

    return (
      <div className={styles.listForm}>
        <SampleList
          siteUrl={siteUrl}
          context={context}
        />
      </div>
    );
  }
}
