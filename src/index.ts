import { MegaverseDrawer, ComethsApi, PolyanetsApi, SoloonsApi, AstralObjectPosition } from "./api"

const main = async () => {
	const config = { baseUrl: "https://challenge.crossmint.io", candidateId: "adb9ceca-0330-4a4b-bc0e-65506d280450", bounds: { rows: 11, columns: 11 } };
	const polyanetsApi = new PolyanetsApi(config)
	const soloonsApi = new SoloonsApi(config)
	const comethsApi = new ComethsApi(config)

	const drawer = new MegaverseDrawer(polyanetsApi, soloonsApi, comethsApi);

	// await drawer.deleteAstralObjectFromMap(polyanetsApi);

	// await drawer.drawX(polyanetsApi, 7, { column: 2, row: 2 });



}


main().catch(err => {
	console.log(err)
})