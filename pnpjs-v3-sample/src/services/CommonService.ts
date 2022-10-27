import { getSP } from '../config/pnp-config';
import { SPFI } from '@pnp/sp';
import logger from '../utils/Logger';

export default class CommonService {
	private _sp: SPFI = null;

	// ESTABLISH CONTEXT
	constructor() {
		this._sp = getSP();
	}

	public getAll = async (listName: string): Promise<Array<object>> => {
		try {
			const response: object[] = await this._sp.web.lists.getByTitle(listName).items.getAll();

			return response;
		} catch (err) {
			logger.writeError('Common Service', 'getAll', err.stack);
			throw err;
		}
	};

	public getListItems = async (listName: string, siteUrl: string): Promise<Array<object>> => {
		const listItems: string = `ID, Name, Age, Address, DateOfBirth, Gender, MobileNo`;
		// const Lookup: string = `ContractID, Vendor`;

		try {
			const response = await this._sp.web.lists
				.getByTitle(listName)
				.items.select(listItems)
				// .expand(Lookup)
				.getAll();

			console.log(response);

			return response;
		} catch (err) {
			logger.writeError('Common Service', 'getAll', err.stack);
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

	public updateItem = async (listName: string, itemId: number, data: object): Promise<any> => {
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
