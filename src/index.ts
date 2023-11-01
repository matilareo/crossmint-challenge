import { MegaverseApi } from "./api"
import { MegaverseDrawer } from "./drawer";

const main = async () => {
	const config = { baseUrl: "https://challenge.crossmint.io", candidateId: "adb9ceca-0330-4a4b-bc0e-65506d280450", bounds: { rows: 29, columns: 29 } };
	const megaverseApi = new MegaverseApi(config);
	const drawer = new MegaverseDrawer(megaverseApi);
	await drawer.printGoal();
}


main().catch(err => {
	console.log(err)
})