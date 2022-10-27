import { getSP } from '../config/pnp-config';
import { SPFI } from '@pnp/sp';
import { ISampleList } from '../models/ISampleListState';
import { SitePages } from '../constants/Common';
import logger from '../utils/Logger';
import { ISampleFormState } from '../models/ISampleFormState';

export default class CommonService {
	private _sp: SPFI = null;

	// ESTABLISH CONTEXT
	constructor() {
		this._sp = getSP();
	}

	public getAll = async (listName: string): Promise<Array<object>> => {
		try {
			const response = await this._sp.web.lists.getByTitle(listName).items.getAll();

			return response;
		} catch (err) {
			logger.writeError('Common Service', 'getAll', err.stack);
			throw err;
		}
	};

	public getListItemById = async (listName: string, itemId: number): Promise<ISampleFormState> => {
		try {
			const response = await this._sp.web.lists.getByTitle(listName).items.getById(itemId)();

			return response;
		} catch (err) {
			logger.writeError('Common Service', 'getListItemById', err.stack);
			throw err;
		}
	};

	public getListItems = async (listName: string, siteUrl: string): Promise<Array<ISampleList>> => {
		const listItems: string = `ID, Name, Age, Address, DateOfBirth, Gender, MobileNo`;
		const sampleListItems: ISampleList[] = [];

		try {
			const response = await this._sp.web.lists
				.getByTitle(listName)
				.items.select(listItems)
				.getAll();

			for (let item of response) {
				const sampleListItem: ISampleList = {
					Name: null,
					Age: null,
					Address: null,
					DateOfBirth: null,
					Gender: null,
					MobileNo: null,
					RecordViewUrl: null,
				};

				sampleListItem.Name = item.Name;
				sampleListItem.Age = item.Age;
				sampleListItem.Address = item.Address;
				sampleListItem.DateOfBirth = item.DateOfBirth;
				sampleListItem.Gender = item.Gender;
				sampleListItem.MobileNo = item.MobileNo;
				sampleListItem.RecordViewUrl = `${siteUrl}${SitePages.SampleForm}${item.Id}`;
				sampleListItems.push(sampleListItem);
			}

			return sampleListItems;
		} catch (err) {
			logger.writeError('Common Service', 'getListItems', err.stack);
			throw err;
		}
	};

	public createItem = async (listName: string, data: object): Promise<object> => {
		try {
			const request = await this._sp.web.lists.getByTitle(listName).items.add(data);

			const response = request.data;
			return response;
		} catch (err) {
			logger.writeError('Common Service', 'createItem', err.stack);
			throw err;
		}
	};

	public updateItem = async (listName: string, itemId: number, data: object): Promise<object> => {
		try {
			const request = await this._sp.web.lists
				.getByTitle(listName)
				.items.getById(itemId)
				.update(data);

			const response = request.data;
			return response;
		} catch (err) {
			logger.writeError('Common Service', 'updateItem', err);
			throw err;
		}
	};

	public removeItem = async (listName: string, data: object): Promise<any> => {
		try {
			const request = await this._sp.web.lists.getByTitle(listName).items.add(data);
			const response = request.data;

			return response;
		} catch (err) {
			logger.writeError('Common Service', 'removeItem', err);
			throw err;
		}
	};
}
