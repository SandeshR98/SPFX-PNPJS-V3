import { getSP } from '../config/pnp-config';
import { SPFI } from '@pnp/sp';
import logger from '../utils/Logger';

export default class CommonService {
	private _sp: SPFI = null;

	// ESTABLISH CONTEXT
	constructor() {
		this._sp = getSP();
	}

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
