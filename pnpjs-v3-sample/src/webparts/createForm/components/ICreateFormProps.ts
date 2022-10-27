import { WebPartContext } from '@microsoft/sp-webpart-base';

export interface ICreateFormProps {
	context: WebPartContext;
	siteUrl: string;
	recordId: string;
}
