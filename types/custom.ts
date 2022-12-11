import { Category, Game, Gamer, Mechanic } from '@prisma/client';

export interface IFullGame extends Game {
	mechanics: Mechanic[] | []
	categories: Category[] | []
	gamer: number
}
