export const SIZE: number = 6;
export const EMPTY: number = 0;
export const BLACK: number = 1;
export const WHITE: number = 2;

export type Board = number[][];
export type Move = [number, number];

export type Score = {
  black: number;
  white: number;
};

export const initializeBoard = (): Board => {
  const board: Board = Array.from({ length: SIZE }, () => Array(SIZE).fill(EMPTY));
  const mid = SIZE / 2;
  board[mid - 1][mid - 1] = WHITE;
  board[mid - 1][mid] = BLACK;
  board[mid][mid - 1] = BLACK;
  board[mid][mid] = WHITE;
  return board;
};

export const directions: Move[] = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],         [0, 1],
  [1, -1], [1, 0], [1, 1],
];

export const isValidMove = (board: Board, row: number, col: number, player: number): boolean => {
  if (board[row][col] !== EMPTY) return false;
  const opponent = player === BLACK ? WHITE : BLACK;

  for (const [dx, dy] of directions) {
    let x = row + dx, y = col + dy;
    let foundOpponent = false;

    while (x >= 0 && x < SIZE && y >= 0 && y < SIZE && board[x][y] === opponent) {
      foundOpponent = true;
      x += dx;
      y += dy;
    }

    if (foundOpponent && x >= 0 && x < SIZE && y >= 0 && y < SIZE && board[x][y] === player) {
      return true;
    }
  }
  return false;
};

export const getValidMoves = (board: Board, player: number): Move[] => {
  const moves: Move[] = [];
  for (let row = 0; row < SIZE; row++) {
    for (let col = 0; col < SIZE; col++) {
      if (isValidMove(board, row, col, player)) {
        moves.push([row, col]);
      }
    }
  }
  return moves;
};

export const flipDiscs = (board: Board, row: number, col: number, player: number): Board => {
  const newBoard: Board = board.map((row) => [...row]);
  newBoard[row][col] = player;
  const opponent = player === BLACK ? WHITE : BLACK;

  for (const [dx, dy] of directions) {
    let x = row + dx, y = col + dy;
    const path: Move[] = [];

    while (x >= 0 && x < SIZE && y >= 0 && y < SIZE && board[x][y] === opponent) {
      path.push([x, y]);
      x += dx;
      y += dy;
    }

    if (x >= 0 && x < SIZE && y >= 0 && y < SIZE && board[x][y] === player) {
      path.forEach(([px, py]) => (newBoard[px][py] = player));
    }
  }
  return newBoard;
};

export const getScore = (board: Board): Score => {
  let blackCount = 0, whiteCount = 0;
  board.flat().forEach((cell) => {
    if (cell === BLACK) blackCount++;
    if (cell === WHITE) whiteCount++;
  });
  return { black: blackCount, white: whiteCount };
};
