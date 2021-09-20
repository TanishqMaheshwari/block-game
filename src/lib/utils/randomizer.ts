import { GridPiece, BagRandomizer } from '../types';

export const createTetrominoBag = () => {
  const bag = [
    GridPiece.I,
    GridPiece.O,
    GridPiece.T,
    GridPiece.J,
    GridPiece.L,
    GridPiece.S,
    GridPiece.Z,
  ];
  // randomize array in-place using Durstenfeld shuffle algorithm
  // time: O(n)
  for (let i = bag.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [bag[i], bag[j]] = [bag[j], bag[i]];
  }
  return bag;
};

function* randomizer(): BagRandomizer {
  while (true) {
    yield* createTetrominoBag();
  }
}

export default class Randomizer {
  generator: BagRandomizer;
  buffer: GridPiece[];

  constructor() {
    this.generator = randomizer();
    this.buffer = [];
  }

  checkBuffer(): void {
    while (this.buffer.length < 50) {
      this.buffer.push(this.generator.next().value);
    }
  }

  pop(): GridPiece {
    this.checkBuffer();
    console.log('POP', { buffer: this.buffer.join() });

    return this.buffer.shift() as GridPiece;
  }

  peek(): GridPiece {
    this.checkBuffer();
    console.log('PEEK', { buffer: this.buffer.join() });

    return this.buffer[0] as GridPiece;
  }
}
