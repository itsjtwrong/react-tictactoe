import React from 'react';
import ReactDOM from 'react-dom';
import { calculateWinner } from './index';

test('empty board returns null', () => {
    expect(calculateWinner(Array(9).fill(null))).toBeNull();
})