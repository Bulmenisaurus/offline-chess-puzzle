import { ChessBoard } from './chessboard';

export interface Puzzle {
    fen: string;
    moves: string[];
    rating: number;
}

const getPuzzle = async (rating: number) => {
    const req = await fetch(`http://localhost:3000/puzzle?rating=${rating}`);
    const puzzle: Puzzle = await req.json();

    return puzzle;
};

const useRating = (): [() => number, (_: number) => void] => {
    let puzzleRating = parseInt(localStorage.getItem('rating') ?? '2200');

    const getRating = (): number => {
        return puzzleRating;
    };

    const setRating = (newRating: number) => {
        puzzleRating = newRating;
        localStorage.setItem('rating', `${newRating}`);
        console.log({ newRating });
    };

    return [getRating, setRating];
};

const main = async () => {
    const [getRating, setRating] = useRating();

    const container = document.getElementById('chessboard')!;
    const nextButton = document.getElementById('next-button')!;
    const title = document.getElementById('title')!;

    const chessboard = new ChessBoard(container);

    const puzzle = await getPuzzle(getRating());

    chessboard.loadPuzzle(puzzle);
    const fenToMove = puzzle.fen.split(' ')[1];
    // actual color of the user differs from the color set in the fen, since the fen includes one prerequisite move
    const toMove = fenToMove === 'w' ? 'Black' : 'White';
    title.innerText = `${toMove} to move`;

    chessboard.puzzleSolve$.subscribe((completion) => {
        if (completion.successful) {
            nextButton.classList.add('yes');
            setRating(getRating() + 10);
        } else {
            nextButton.classList.add('no');
            setRating(getRating() - 10);
        }
    });

    nextButton.onclick = async () => {
        nextButton.classList.remove('yes', 'no');
        const puzzle = await getPuzzle(getRating());

        chessboard.loadPuzzle(puzzle);
    };
};

main();
