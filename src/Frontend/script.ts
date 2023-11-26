import { ChessBoard } from './chessboard';

export interface Puzzle {
    fen: string;
    moves: string[];
    rating: number;
}

const getPuzzle = async (rating: number, pc: PuzzleCache) => {
    const cached = pc.getCachedPuzzle();
    if (cached !== null) {
        return cached;
    }

    const req = await fetch(`http://localhost:3000/puzzle?rating=${rating}`);
    const puzzle: Puzzle = await req.json();

    pc.setCachedPuzzle(puzzle);

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

// cache the last shown puzzle to the user, so that if they reload the page, the same puzzle is shown
// especially useful when you have hot-reloading enabled and any page refresh causes a puzzle to be requested
class PuzzleCache {
    getCachedPuzzle(): Puzzle | null {
        const stored = localStorage.getItem('puzzleCache');

        if (stored === null) {
            return null;
        } else {
            return JSON.parse(stored);
        }
    }

    setCachedPuzzle(puzzle: Puzzle) {
        localStorage.setItem('puzzleCache', JSON.stringify(puzzle));
    }

    clearCachedPuzzle() {
        localStorage.removeItem('puzzleCache');
    }
}

const main = async () => {
    const [getRating, setRating] = useRating();

    const container = document.getElementById('chessboard')!;
    const nextButton = document.getElementById('next-button')!;
    const title = document.getElementById('title')!;

    const pc = new PuzzleCache();

    const chessboard = new ChessBoard(container);

    const puzzle = await getPuzzle(getRating(), pc);

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
            console.log(`Expected line: ${chessboard.puzzleMoves.slice(1).join(' ')}`);
        }

        pc.clearCachedPuzzle();
    });

    nextButton.onclick = async () => {
        nextButton.classList.remove('yes', 'no');
        const puzzle = await getPuzzle(getRating(), pc);

        chessboard.loadPuzzle(puzzle);
    };
};

main();
