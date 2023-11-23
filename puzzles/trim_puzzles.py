import sys
import pandas as pd


csv_filepath = sys.argv[1]
csv_out_filepath = sys.argv[2]


f = pd.read_csv(csv_filepath)

# select only puzzles with a rating above 2000
f = f.loc[f['Rating'] > 2000]

# https://stackoverflow.com/a/34455724/13996389
keep_col = ['FEN', 'Moves', 'Rating']
f = f[keep_col]

f = f.sort_values('Rating')

f.to_csv(csv_out_filepath, index=False)
