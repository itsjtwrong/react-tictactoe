import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button 
            className={` square ${props.isWin ? "win-state" : ""} `}
            onClick = {props.onClick}>
            {props.value}
        </button>
    );
}
  
  class Board extends React.Component {
    renderSquare(i,isWin) {
      return (
        <Square 
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}
            isWin={isWin}    
      />
      );
    }
  
    render() {
      return (
        <div>
          {[...Array(3)].map((x,i) => {
            return (<div className="board-row">
              {[...Array(3)].map((x,j) => {
                return this.renderSquare((i * 3) + j,
                (this.props.winner && this.props.winner.includes((i * 3) + j)));
              })}
            </div>)
          })
        }
        </div>
      )
    }
  }
  
  class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            movePos: [],
            stepNumber: 0,
            xIsNext: true,
            ascending: false,
        }
    }

    handleClick(i) {
        const history = this.state.history.slice(0,
          this.state.stepNumber + 1);
        const movePos = this.state.movePos.slice(0, this.state.stepNumber);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        const ascending = this.state.ascending;
        if(calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
            }]),
            movePos: movePos.concat(i),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
            ascending: ascending,
        })
    }

    handleCheck() {
      const ascending = this.state.ascending;
      this.setState({
        ascending: !ascending,
      })
    }

    jumpTo(step) {
      this.setState({
        stepNumber: step,
        xIsNext: (step % 2) === 0,
      })
    }

    render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner =
        calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            let movePos = this.state.movePos;
            const desc = move ?
                'Go to move #' + move + " (" + Math.floor(movePos[move-1] / 3) + ", " + (movePos[move-1] % 3) + ")":
                'Go to game start';
            return (
                <li key={move}>
                    <button onClick={() =>
                    this.jumpTo(move)}>{this.state.stepNumber === move ? <b>{desc}</b> : desc}
                    </button>
                </li>
            );
        });
    let status;
    if(winner) {
        status = 'Winner: ' + winner[0];
    } else {
        status = 'Next player: ' +
        (this.state.xIsNext ? 'X' : 'O');
    }
      return (
        <div className="game">
          <div className="game-board">
            <Board 
                squares={current.squares}
                onClick = {(i) => this.handleClick(i)}
                winner = {winner ? winner[1] : null}
                />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ol className={this.state.ascending ? "ascending" : ""}>{moves}</ol>
            <label>Ascending?</label><input  onChange={() => this.handleCheck()} type="checkbox" ></input>
          </div>
        </div>
      );
    }
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  
  // [Array-of Squares] -> [string, [Array-of Ints]] OR NULL
  // used to check win/draw state, and if either state has been hit,
  // return as such
  // win state [Winning-player (X or O), Winning-row]
  // draw state ["DRAW", empty-list]

  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    let drawCount = 0;
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return [squares[a], lines[i]];
      } else if (squares[a] && squares[b] && squares[c]) {
        drawCount++;
        if(drawCount === 8) {
          return ["DRAW", []];
        }
      }
    }
    return null;
  }