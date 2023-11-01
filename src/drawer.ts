import { MegaverseApi } from "./api";
import { AstralObject } from "./types";
import { sleep } from "./utils"

const API_DELAY = 1500
export class MegaverseDrawer {
	constructor(private api: MegaverseApi) {
	}
	async printGoal() {
		const megaverseMap = await this.api.getMap();
		for (let astralObject in megaverseMap) {
			for (let elm of megaverseMap[astralObject]) {
				await sleep(API_DELAY);
				await this.api.set(astralObject as AstralObject, elm);
			}
		}
	}
}