import React from 'react';
import { calculateWinner } from './index';

test('empty board returns null', () => {
    expect(calculateWinner(Array(9).fill(null))).toBeNull();
})

test('winning board returns correct win state', () => {
    let xWin = ["X", null, null, "X", null, null, "X", null, null];
    let oWin = ["O", "O", "O", null, null, null, null, null, null];
    expect(calculateWinner(xWin)).toEqual(["X", [0,3,6]]);
    expect(calculateWinner(oWin)).toEqual(["O",[0,1,2]]);
})

test('draw board returns draw state', () => {
    let draw = ["X", "O", "X", "O", "O", "X", "X", "X", "O"];
    expect(calculateWinner(draw)).toEqual(["DRAW", []]);
})

test('incorrectly sized board throws', () => {
    expect( () => {
        calculateWinner(Array(8).fill(null))
    }).toThrow();
})