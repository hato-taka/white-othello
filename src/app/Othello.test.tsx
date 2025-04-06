import React from "react";
import { render, fireEvent } from "@testing-library/react";
import Othello from "./Othello";
import {
    initializeBoard,
    isValidMove,
    flipDiscs,
    SIZE,
    EMPTY,
    WHITE,
    BLACK,
} from "./othelloLogic";

jest.mock("./othelloLogic", () => ({
    ...jest.requireActual("./othelloLogic"),
    isValidMove: jest.fn(),
    flipDiscs: jest.fn(),
}));

describe("Othello handleClick function", () => {
    it("should not update the board if the move is invalid", () => {
        (isValidMove as jest.Mock).mockReturnValue(false);
        const { getByText } = render(<Othello />);
        const initialBoard = initializeBoard();

        fireEvent.click(getByText("⚪ プレイヤーの手番です"));

        expect(isValidMove).toHaveBeenCalled();
        expect(flipDiscs).not.toHaveBeenCalled();
    });

    it("should update the board and switch to CPU turn if the move is valid", () => {
        (isValidMove as jest.Mock).mockReturnValue(true);
        const { getByText } = render(<Othello />);
        const initialBoard = initializeBoard();

        fireEvent.click(getByText("⚪ プレイヤーの手番です"));

        expect(isValidMove).toHaveBeenCalled();
        expect(flipDiscs).toHaveBeenCalled();
    });
});