import { ChessBoard } from './chessboard';

export interface Puzzle {
    fen: string;
    moves: string[];
    rating: number;
}

const getPuzzle = async () => {
    const req = await fetch('http://localhost:3000/puzzle');
    const puzzle: Puzzle = await req.json();

    return puzzle;
};

const main = async () => {
    console.log('Hello, world!');
    const puzzle = await getPuzzle();
    const container = document.getElementById('chessboard')!;

    const chessboard = new ChessBoard(container);
    chessboard.loadPuzzle(puzzle);
};

main();
