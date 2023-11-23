#!/bin/bash

echo "Downloading file"

# https://database.lichess.org/#puzzles
if [ ! -f ./puzzles/lichess_db_puzzle.csv.zst ]; then
    curl https://database.lichess.org/lichess_db_puzzle.csv.zst -o .puzzles/lichess_db_puzzle.csv.zst
else
    echo "File already Downloaded"
fi

echo "Extracting file"

if [ ! -f ./puzzles/lichess_db_puzzle.csv ]; then
    zstd ./puzzles/lichess_db_puzzle.csv.zst --decompress -o ./puzzles/lichess_db_puzzle.csv
else
    echo "Extracted file already exists"
fi

echo "Filtering puzzles and columns"

if [ ! -f ./puzzles/puzzles.csv ]; then
    python3 ./puzzles/trim_puzzles.py ./puzzles/lichess_db_puzzle.csv ./puzzles/puzzles.csv
else
    echo "Filtered file already exists"
fi

echo "Done!"