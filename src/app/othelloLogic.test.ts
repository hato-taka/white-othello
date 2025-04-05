// FILE: othelloLogic.test.ts
import { getScore } from './othelloLogic';

describe('getScore', () => {
  it('should return the correct score for a given board', () => {
    // Arrange
    const board = [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 2, 0, 0, 0],
      [0, 0, 0, 2, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
    ];

    const expectedScore = { white: 2, black: 2 };

    // Act
    const score = getScore(board);

    // Assert
    expect(score).toEqual(expectedScore);
  });

  it('should return zero scores for an empty board', () => {
    // Arrange
    const board = Array(8).fill(0).map(() => Array(8).fill(0));
    const expectedScore = { white: 0, black: 0 };

    // Act
    const score = getScore(board);

    // Assert
    expect(score).toEqual(expectedScore);
  });

  it('should handle a board with only one color', () => {
    // Arrange
    const board = Array(8).fill(0).map(() => Array(8).fill(1)); // 全て黒
    const expectedScore = { white: 0, black: 64 }; // 修正

    // Act
    const score = getScore(board);

    // Assert
    expect(score).toEqual(expectedScore);
  });
});