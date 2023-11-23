import express from 'express';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello, world!');
});

app.get('/puzzle', (req, res) => {
    res.json({
        fen: '3r2k1/p1Q1rp2/1p4p1/1b1q4/6P1/4PP2/PP2B3/4RK1R w - - 1 28',
        moves: 'c7h2 d5f3 f1g1 f3e3'.split(' '),
        rating: 2001,
    });
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
