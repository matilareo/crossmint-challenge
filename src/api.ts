import axios, { AxiosInstance } from "axios";
import { AstralObject, AstralObjectArgs, ComethsDirection, MegaverseConfig, ParsedMegaverseMap, SoloonsColor } from "./types";


export class MegaverseApi {

	private httpClient: AxiosInstance;

	constructor(readonly config: MegaverseConfig) {
		const client = axios.create({ baseURL: config.baseUrl, data: { candidateId: config.candidateId } })
		client.interceptors.request.use(
			function (conf) {
				conf.data = {
					...conf.data,
					candidateId: config.candidateId
				};
				return conf;
			},
			function (error) {
				return Promise.reject(error);
			}
		);
		this.httpClient = client;
	}

	private parseAstralObject = (astralObject: string): [string, { color?: SoloonsColor, direction?: ComethsDirection }] => {
		const splited = astralObject.split('_');
		let name: string;
		let args: { color?: SoloonsColor, direction?: ComethsDirection } = {};
		if (splited[1]) {
			name = splited[1];
			const argValue = splited[0].toLowerCase()
			if ((Object.values(SoloonsColor)).includes(argValue as SoloonsColor))
				args = { color: argValue as SoloonsColor }
			else {
				args = { direction: argValue as ComethsDirection }
			}
		}
		else {
			name = splited[0];
		}

		return [name, args];
	}

	private astralObjectToToken = (name: string): AstralObject | undefined => {
		const result: AstralObject = name.toLowerCase() + 's' as AstralObject;
		if (!Object.values(AstralObject).includes(result))
			return undefined;
		return result;
	}

	private parseMap = (megaverse: string[][]): ParsedMegaverseMap => {
		const result: { [key: string]: AstralObjectArgs[] } = {};
		megaverse.forEach((megaverseRow, rowIndex) => {
			megaverseRow.forEach((elm, columnIndex) => {
				const [name, args] = this.parseAstralObject(elm);
				const astralObjectApiToken = this.astralObjectToToken(name);
				if (!astralObjectApiToken)
					return;
				if (!result[`${astralObjectApiToken}`])
					result[`${astralObjectApiToken}`] = [];
				result[`${astralObjectApiToken}`].push({ column: columnIndex, row: rowIndex, ...args })
			})
		})
		return result;
	}

	async set(astralObject: AstralObject, args: AstralObjectArgs): Promise<void> {
		if (args.column > this.config.bounds.columns || args.row > this.config.bounds.rows)
			throw `Request out of bounds, bounds are: { rows: ${this.config.bounds.rows}, columns: ${this.config.bounds.columns} }`;
		console.log(`${`/api/${astralObject}` + ' ' + JSON.stringify(args)}`)
		await this.httpClient.post(`/api/${astralObject}`, args)
	}

	async delete(astralObject: AstralObject, args: AstralObjectArgs): Promise<void> {
		await this.httpClient.delete(`/api/${astralObject}`, { data: { ...args } })
	}

	async getMap(): Promise<ParsedMegaverseMap> {
		return this.parseMap((await this.httpClient.get(`/api/map/${this.config.candidateId}/goal`)).data.goal)
	}
}



