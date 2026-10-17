# EC-react-tic-tac-toe

Additional React Tic-Tac-Toe challenges, based on the React tutorial starter.

## Run

```bash
npm install
npm run dev
```

## Git branches

`main` and `Challenge-7` include the completed challenges. Each challenge is also available as its own progressively implemented branch: `Challenge-1`, `Challenge-2`, `Challenge-3`, `Challenge-4`, `Challenge-5`, `Challenge-6`, and `Challenge-7`.

Challenge 1: RegEx winner detection on the 3×3 board.
Challenge 2: Reset button.
Challenge 3: Automated O moves with winning, blocking, and ordered placement.
Challenge 4: Player switching so the computer can take the current move.
Challenge 5: Recursive minimax for 3×3 play.
Challenge 6: Adjustable row and column counts, with generalized win detection.
Challenge 7: Board resizing during play, preserving existing squares in their upper-left positions.

On larger boards, a winning/blocking priority computer strategy is used instead of exhaustive minimax to keep moves responsive. Board sizes range from 3 to 8 per dimension. Resizing preserves the current board but starts a new time-travel history, since earlier moves refer to different square indices.

## Publish to GitHub

Create an empty repository named `EC-react-tic-tac-toe` in your GitHub account, then from this folder run:

```bash
git remote add origin https://github.com/YOUR_USERNAME/EC-react-tic-tac-toe.git
git push -u origin main
git push origin Challenge-1 Challenge-2 Challenge-3 Challenge-4 Challenge-5 Challenge-6 Challenge-7
```

If using the ZIP without its `.git` folder, first restore the included `EC-react-tic-tac-toe.bundle`:

```bash
git clone EC-react-tic-tac-toe.bundle restored-project
cd restored-project
git branch -r
```

The ZIP includes a Git repository with all branches and the complete history.
