import { getSP } from '../config/pnp-config';
import { SPFI } from '@pnp/sp';
import { Logger, LogLevel } from '@pnp/logging';
export default class CommonService {
	private _sp: SPFI = null;

	// ESTABLISH CONTEXT
	constructor() {
		this._sp = getSP();
	}

	public createItem = async (listName: string, data: object): Promise<any> => {
		try {
			const request = await this._sp.web.lists.getByTitle(listName).items.add(data);

			console.log(request);
			const response = request.data;

			return response;
		} catch (err) {
			console.log(err);
			Logger.write('This is logging a simple string', LogLevel.Error);
			throw err;
		}
	};
}
