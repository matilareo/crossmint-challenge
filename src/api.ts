import axios, { AxiosInstance } from "axios";

enum AstralObject {
	POLYANETS = "polyanets",
	SOLOONS = "soloons",
	COMETHS = "comeths"
}

enum SoloonsColor {
	BLUE = "blue",
	RED = "red",
	PURPLE = "purple",
	WHITE = "white"
}

enum ComethsDirection {
	UP = "up",
	DOWN = "down",
	RIGHT = "right",
	LEFT = "left"
}

export interface AstralObjectPosition {
	row: number,
	column: number
}

interface MegaverseConfig {
	baseUrl: string,
	candidateId: string,
	bounds: {
		rows: number,
		columns: number
	}
}

interface AstralObjectSetArgs {
	row: number,
	column: number
}

interface PolyanetsSetArgs extends AstralObjectPosition {

}

interface SoloonsSetArgs extends AstralObjectPosition {
	color: SoloonsColor
}

interface ComethsSetArgs extends AstralObjectPosition {
	direction: ComethsDirection
}

abstract class BaseAstralObjectApi<T extends AstralObjectSetArgs> {
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
	abstract readonly astralObject: AstralObject;
	async set(args: T): Promise<void> {
		if (args.column > this.config.bounds.columns || args.row > this.config.bounds.rows)
			return;
		await this.httpClient.post(`/api/${this.astralObject}`, args)
	}
	async delete(position: AstralObjectPosition): Promise<void> {
		await this.httpClient.delete(`/api/${this.astralObject}`, { data: { ...position } })
	}
	async getMap(): Promise<any> {
		return await this.httpClient.get(`/api/map/${this.config.candidateId}/goal`)
	}
}

export class PolyanetsApi extends BaseAstralObjectApi<PolyanetsSetArgs> {
	astralObject = AstralObject.POLYANETS;
}

export class SoloonsApi extends BaseAstralObjectApi<SoloonsSetArgs> {
	astralObject = AstralObject.SOLOONS;

}
export class ComethsApi extends BaseAstralObjectApi<ComethsSetArgs> {
	astralObject = AstralObject.COMETHS;
}

export class MegaverseDrawer {

	constructor(private polyanetsApi: PolyanetsApi, private soloonsApi: SoloonsApi, private comethsApi: ComethsApi) {
	}

	// async deleteAstralObjectFromMap(api: BaseAstralObjectApi<AstralObjectSetArgs>) {
	// 	const promArr = [];
	// 	for (let i = 0; i < api.config.bounds.columns; i++) {
	// 		for (let j = 0; j < api.config.bounds.rows; j++) {
	// 			promArr.push(api.delete({ row: i, column: j }));
	// 		}
	// 	}
	// 	await Promise.all(promArr);
	// }

	async deleteAstralObjectFromMap(api: BaseAstralObjectApi<AstralObjectSetArgs>) {
		for (let i = 0; i < api.config.bounds.columns; i++) {
			for (let j = 0; j < api.config.bounds.rows; j++) {
				console.log(`deleting (${i};${j})`)
				await sleep(1000)
				await api.delete({ row: i, column: j });
			}
		}
	}

	// async drawX(api: BaseAstralObjectApi<AstralObjectSetArgs>, size: number, startPosition: AstralObjectPosition) {
	// 	if (size > api.config.bounds.columns || size > api.config.bounds.rows) {
	// 		throw `Invalid X size`
	// 	}
	// 	if (startPosition.column + size > api.config.bounds.columns || startPosition.row + size > api.config.bounds.rows) {
	// 		throw `Invalid starting position`
	// 	}

	// 	const promArr = [];
	// 	for (let i = startPosition.column; i < startPosition.column + size; i++) {
	// 		for (let j = startPosition.row; j < startPosition.row + size; j++) {
	// 			promArr.push(api.set({ row: i, column: j }));
	// 		}
	// 	}
	// 	await Promise.all(promArr);
	// }
	async drawX(api: BaseAstralObjectApi<AstralObjectSetArgs>, size: number, startPosition: AstralObjectPosition) {
		if (size > api.config.bounds.columns || size > api.config.bounds.rows) {
			throw `Invalid X size`
		}
		if (startPosition.column + size > api.config.bounds.columns || startPosition.row + size > api.config.bounds.rows) {
			throw `Invalid starting position`
		}

		for (let i = startPosition.column; i < startPosition.column + size; i++) {
			for (let j = startPosition.row; j < startPosition.row + size; j++) {
				if (i == j || j == -i + startPosition.column + size + 1) {
					console.log(`drawing x (${i};${j})`)
					await sleep(1000)
					await api.set({ row: i, column: j });
				}


			}
		}
	}
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

