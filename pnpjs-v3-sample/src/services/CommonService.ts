import { getSP } from '../config/pnp-config';
import { SPFI } from '@pnp/sp';
import { ISampleList } from '../models/ISampleListState';
import { SitePages } from '../constants/Common';
import { ISampleFormState } from '../models/ISampleFormState';
import { DropdownMenuItemType, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import logger from '../utils/Logger';
import { DocumentLibrary } from '../constants/Inventory';
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
			const response = await this._sp.web.lists.getByTitle(listName).items.select(listItems).getAll();

			for (const item of response) {
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

	public getListIdByListName = async (listName: string): Promise<string> => {
		const listItems: string = `Id`;

		try {
			const response = await this._sp.web.lists.getByTitle(listName).select(listItems)();
			const listId = response.Id;

			return listId;
		} catch (err) {
			logger.writeError('Common Service', 'getListItemById', err.stack);
			throw err;
		}
	};

	public getChoiceField = async (listName: string, field: string): Promise<IDropdownOption[]> => {
		const choices: IDropdownOption[] = [];

		try {
			const response = await this._sp.web.lists.getByTitle(listName).fields.getByTitle(field)();
			const options = response.Choices;
			for (const item of options) choices.push({ key: item, text: item });

			const dropdownHeader = {
				key: `${field?.toLowerCase()}Header`,
				text: field,
				itemType: DropdownMenuItemType.Header,
			};

			choices.unshift(dropdownHeader);

			return choices;
		} catch (err) {
			logger.writeError('Common Service', 'getChoiceField', err.stack);
			throw err;
		}
	};

	public checkLoggedUserGroups = async (groupName: string): Promise<boolean> => {
		try {
			const loggedUserGroups = await this._sp.web.currentUser.groups();
			const hasPermissions = loggedUserGroups.some((x) => x.Title === groupName);

			return hasPermissions;
		} catch (err) {
			logger.writeError('Common Service', 'checkLoggedUserGroups', err.stack);
			throw err;
		}
	};

	// PRIVATE METHOD TO CHECK IF FOLDER EXIST IN DOCUMENT LIBRARY
	private isLibraryFolderExist = async (folderPath: string): Promise<boolean> => {
		const relativePath: string = `${DocumentLibrary.Documents.RelativePath}${folderPath}`;

		try {
			const libraryFolder = await this._sp.web.getFolderByServerRelativePath(relativePath)();

			return libraryFolder.Exists;
		} catch (err) {
			logger.writeError('Common Service', 'isLibraryFolderExist', err.stack);
			return false;
		}
	};

	public addFileToDocumentLibrary = async (library: string, folder: string, files: FileList): Promise<void> => {
		const folderPath: string = `${library}/${folder}`;

		try {
			const isFolder = await this.isLibraryFolderExist(folderPath);
			if (!isFolder) await this._sp.web.folders.addUsingPath(folderPath);

			for (let index = 0; index < files?.length; index++) {
				const file = files[index];
				const fileName = file.name;

				await this._sp.web
					.getFolderByServerRelativePath(folderPath)
					.files.addUsingPath(fileName, file, { Overwrite: true });
			}
		} catch (err) {
			logger.writeError('Common Service', 'createItem', err.stack);
			throw err;
		}
	};

	public createItem = async (listName: string, data: object): Promise<object> => {
		try {
			const response = await this._sp.web.lists.getByTitle(listName).items.add(data);

			return response.data;
		} catch (err) {
			logger.writeError('Common Service', 'createItem', err.stack);
			throw err;
		}
	};

	public updateItem = async (listName: string, itemId: number, data: object): Promise<object> => {
		try {
			const response = await this._sp.web.lists.getByTitle(listName).items.getById(itemId).update(data);

			return response.data;
		} catch (err) {
			logger.writeError('Common Service', 'updateItem', err);
			throw err;
		}
	};

	public removeItem = async (listName: string, itemId: number): Promise<void> => {
		try {
			await this._sp.web.lists.getByTitle(listName).items.getById(itemId).delete();
		} catch (err) {
			logger.writeError('Common Service', 'removeItem', err);
			throw err;
		}
	};
}
