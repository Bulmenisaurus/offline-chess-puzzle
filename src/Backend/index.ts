import express from 'express';
import cors from 'cors';
import fs from 'fs';
import { getPuzzle } from './getPuzzle';

const app = express();
const port = 3000;

app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello, world!');
});

app.get('/puzzle', (req, res) => {
    // // todo: report typescript bug? when the code in this function is unreachable an error is reported that doesn't exists the the code is reachable
    // res.json({
    //     fen: 'r1bq1r2/pp1nnkpQ/5b1B/3pp2P/3P2P1/2P2N2/PPB2P2/1R2K2R b K - 0 20',
    //     moves: ['f8h8', 'f3g5', 'f6g5', 'h7g7'],
    //     rating: 2240,
    // });
    // return;

    const rating = req.query.rating;

    if (typeof rating !== 'string') {
        res.sendStatus(422).send("Expected string parameter 'rating'");
        return;
    }

    const parsedRating = parseInt(rating);

    if (isNaN(parsedRating)) {
        res.sendStatus(422).send("'rating' is not a valid number");
        return;
    }

    getPuzzle(parsedRating, (puzzle) => {
        res.json(puzzle);
    });
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
