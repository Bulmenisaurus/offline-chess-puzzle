import { Chessground } from 'chessground';
import type { Config } from 'chessground/config';
import type { Api } from 'chessground/api';
import { Dests, Key } from 'chessground/types';

import { Chess, Piece, QUEEN, SQUARES } from 'chess.js';
import { Puzzle } from './script';
import { monomitter, Monomitter } from './Monomitter';

export interface PuzzleCompletion {
    successful: boolean;
}

export class ChessBoard {
    chessGround: Api;
    boardState: Chess;
    puzzleMoves: string[];
    puzzleSolve$: Monomitter<PuzzleCompletion>;
    constructor(container: HTMLElement) {
        this.puzzleMoves = [];
        this.boardState = new Chess();

        const config: Config = {
            turnColor: 'white',
            movable: {
                free: false,
                dests: this.getDests(),
                showDests: true,
            },
            autoCastle: true,
            events: {
                change: () => {
                    this.chessGround.set({
                        movable: {
                            dests: this.getDests(),
                        },
                    });
                },
                move: this.move.bind(this),
            },
        };

        this.chessGround = Chessground(container, config);
        this.puzzleSolve$ = monomitter();
    }

    getDests(): Dests {
        // https://github.com/lichess-org/chessground-examples/blob/a2ada8b52fe5b586353afb6d0c0423f91e4540e4/src/util.ts#L5-L12
        const dests = new Map();
        SQUARES.forEach((s) => {
            const ms = this.boardState.moves({ square: s, verbose: true });
            if (ms.length)
                dests.set(
                    s,
                    ms.map((m) => m.to)
                );
        });
        return dests;
    }

    move(orig: Key, dest: Key) {
        // todo: some puzzles may require underpromotion
        const move = this.boardState.move({ from: orig, to: dest, promotion: QUEEN });
        this.chessGround.set({ fen: this.boardState.fen() });

        const currentPly = this.boardState.history().length;
        const expectedMove = this.puzzleMoves[currentPly - 1];

        if (expectedMove == move.lan) {
            if (this.puzzleMoves.length === currentPly) {
                this.puzzleSolve$.publish({ successful: true });
                return;
            }

            this.doMove(this.puzzleMoves[currentPly]);
        } else {
            this.puzzleSolve$.publish({ successful: false });
        }
    }

    loadPuzzle(puzzle: Puzzle) {
        this.boardState.load(puzzle.fen);
        const puzzleOrientation = puzzle.fen.split(' ')[1] === 'w' ? 'black' : 'white';
        this.chessGround.set({
            orientation: puzzleOrientation,
        });
        this.puzzleMoves = puzzle.moves;

        this.doMove(this.puzzleMoves[0]);

        // this.chessGround.state.events.change!();
    }

    doMove(move: string) {
        this.boardState.move(move);
        this.chessGround.set({ fen: this.boardState.fen() });
        this.chessGround.set({
            movable: {
                dests: this.getDests(),
            },
        });
    }
}
