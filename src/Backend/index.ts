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
