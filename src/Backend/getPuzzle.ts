// Todo: implement https://stackoverflow.com/a/65046066/13996389 when I get a bug because the types of `Puzzle` on the client and server differ

import fs from 'fs';
import csv from 'csv-parser';

export interface Puzzle {
    fen: string;
    moves: string[];
    rating: number;
}

export const getPuzzle = (rating: number, cb: (_: Puzzle) => void) => {
    const puzzleRange: Puzzle[] = [];

    fs.createReadStream('./puzzles/puzzles.csv')
        .pipe(csv())
        .on('data', (data) => {
            const parsed = {
                fen: data.FEN,
                moves: data.Moves.split(' '),
                rating: parseInt(data.Rating),
            };

            if (Math.abs(rating - parsed.rating) > 10) {
                return;
            }

            puzzleRange.push(parsed);
        })
        .on('close', () => {
            cb(puzzleRange[Math.floor(Math.random() * puzzleRange.length)]);
        });
};
