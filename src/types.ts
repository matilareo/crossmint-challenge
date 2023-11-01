export enum AstralObject {
	POLYANETS = "polyanets",
	SOLOONS = "soloons",
	COMETHS = "comeths"
}

export enum SoloonsColor {
	BLUE = "blue",
	RED = "red",
	PURPLE = "purple",
	WHITE = "white"
}

export enum ComethsDirection {
	UP = "up",
	DOWN = "down",
	RIGHT = "right",
	LEFT = "left"
}

export interface AstralObjectArgs {
	row: number,
	column: number
	color?: SoloonsColor,
	direction?: ComethsDirection
}

export interface MegaverseConfig {
	baseUrl: string,
	candidateId: string,
	bounds: {
		rows: number,
		columns: number
	}
}


export type ParsedMegaverseMap = { [key: string]: AstralObjectArgs[] };
