import React from 'react';
import Cell from '../cell/Cell';
import './MineFiled.css';
import defaultImg from '../../images/smile-default.png';
import winImg from '../../images/smile-win.png';
import loseImg from '../../images/smile-lose.png'
const zeroPad = (num, places) => String(num).padStart(places, '0');

class MineField extends React.Component {
  constructor(props) {
    super(props);
    const {height, width, mines} = props;
    const bricks = this.bricksNumberInitialize(height, width);
    this.state = {
      bricksInGame: bricks,
      minesLeft: mines,
      fieldsToDiscover: (height * width) - mines,
      gameOver: false,
      gamePlay: false,
      seconds: props.seconds,
    };
    this.planMinesOnBoard(bricks, mines);
  }

  bricksNumberInitialize(height, width) {
    return [...Array(height)].map((_, row) =>
      [...Array(width)].map((_, column) => ({
        row: row,
        col: column,
        isMine: false,
        isDiscovered: false,
        isFlagged: false,
        isWhat: false,
        neighborMinesCount: 0,
        isGameLost: false,
        isTimeOut: false,
      }))
    );
  }
  planMinesOnBoard(bricksInGame, minesNumber) {
    let plantedBombs = 0;

    while (plantedBombs < minesNumber) {
      let randomRow = bricksInGame[Math.floor(Math.random() * bricksInGame.length)];
      let randomBrick = randomRow[Math.floor(Math.random() * randomRow.length)];
      if (!randomBrick.isMine) {
        randomBrick.isMine = true;
        this.increaseNumberToBrick(bricksInGame, randomBrick.row, randomBrick.col);
        plantedBombs++;
      }
    }
  }

  increaseNumberToBrick(bricksInGame, row, col) {
    this.getCoordinateOfNeighbor(row, col).forEach(([row, col]) => {
      bricksInGame[row][col].neighborMinesCount++;
    });
  }

  getCoordinateOfNeighbor(row, col) {
    return [
      [row, col + 1],
      [row, col - 1],
      //down
      [row - 1, col],
      [row - 1, col + 1],
      [row - 1, col - 1],
      //up
      [row + 1, col],
      [row + 1, col + 1],
      [row + 1, col - 1],
    ].filter(([row, col]) => this.cutWrongCoordinate(row, col));
  }

  cutWrongCoordinate(row, col) {
    return row >= 0 && col >= 0 && row < this.props.height && col < this.props.width
  }

  selectedMine(brick) {
    const shouldBeDiscover = chosenBrick => chosenBrick.isDiscovered ||
      (chosenBrick.row === brick.row && chosenBrick.col === brick.col);
    let newBoardState = this.state.bricksInGame.map(rows =>
      rows.map(brick => ({
        ...brick,
        isDiscovered: shouldBeDiscover(brick),
        isGameLost: true,
      })));
    this.setState({bricksInGame: newBoardState});
  }

  start = () => {
    if(this.props.seconds === this.state.seconds) {
      this.timerID = setInterval(() => this.tick(), 1000);
    }
  }

  stop = () => {
    clearInterval(this.timerID);
  }

  stopGame() {
    let newTimeOut = this.state.bricksInGame.map(rows =>
      rows.map(brick => ({
        ...brick,
        isTimeOut: true,
      })));

    this.setState({
      bricksInGame: newTimeOut,
      gamePlay: false
    })
    this.stop()
  }

  tick() {
    const oldsec = this.state.seconds;
    if (oldsec > 0) {
      this.setState({seconds: oldsec - 1});
    } else {
      this.stop();
      this.stopGame()
    }
  }

  discoverBricks(row, col) {
    this.discoverBricksByCoordinate(this.getCoordinateToDiscover(row, col));
  }

  discoverBricksByCoordinate(jsonCoords) {
    this.setState({
      bricksInGame: this.state.bricksInGame.map(rows =>
        rows.map(brick => jsonCoords.has(JSON.stringify([brick.row, brick.col])) ?
          {...brick, isDiscovered: true} : brick
        ))
    });
  }

  getCoordinateToDiscover(row, col) {
    const coordinatesToDiscover = new Set();

    const allConnectedBrick = (r, c) => {
      coordinatesToDiscover.add(JSON.stringify([r, c]));
      if (this.state.bricksInGame[r][c].neighborMinesCount === 0) {
        for (let [row, col] of this.getCoordinateOfNeighbor(r, c)) {
          let coords = JSON.stringify([row, col]);
          if (!coordinatesToDiscover.has(coords) && this.canBeDiscovered(row, col)) {
            allConnectedBrick(row, col)
          }
        }
      }
    };

    allConnectedBrick(row, col);

    return coordinatesToDiscover;
  };

  canBeDiscovered(row, col) {
    return this.state.bricksInGame[row][col].isFlagged === false &&
      this.state.bricksInGame[row][col].isDiscovered === false;
  }

  onClickHandle(brick) {
    if (this.isGameFinished() || brick.isDiscovered || brick.isFlagged || brick.isWhat) return;
    if(this.state.gamePlay === false) {
      this.start()
    }
    this.setState({gamePlay: true})
    if (brick.isMine) {
      this.stop()
      this.selectedMine(brick);
    } else {
      this.discoverBricks(brick.row, brick.col);
    }
  }

  onContextMenuHandle(event, brick) {
    event.preventDefault();
    if(this.state.minesLeft > 0) {
      if(this.state.gamePlay === false) {
        this.start()
      }
      if (this.isGameFinished() || brick.isDiscovered) return;

      if ((brick.isFlagged === false) && (brick.isWhat === false)) {
        brick.isFlagged ? brick.isFlagged = false : brick.isFlagged = true;
        this.setState({
          gamePlay: true,
          minesLeft: this.state.minesLeft - 1
        });
      } else if (brick.isFlagged === true) {
        brick.isFlagged = false;
        brick.isWhat = true;
        this.setState({
          minesLeft: this.state.minesLeft + 1
        });
      } else {
        brick.isWhat = false;
      }
    }
  }

  isGameLost = () => [].concat(...this.state.bricksInGame)
    .some(brick => (brick.isMine === true && brick.isDiscovered === true) || brick.isTimeOut === true);

  isGameWon = () => this.countDiscoveredFields() === this.state.fieldsToDiscover;

  isGameFinished = () => this.isGameLost() || this.isGameWon();

  countDiscoveredFields = () => [].concat(...this.state.bricksInGame).filter(brick => brick.isDiscovered).length;

  gameStatus = () => this.isGameLost() ? loseImg : this.isGameWon() ? winImg : defaultImg;

  renderBricks(bricks) {
    return bricks.map(rows =>
      rows.map(brick =>
        <div key={`r${brick.row}c${brick.col}`} className="game__cell">
          <Cell
            row={brick.row}
            col={brick.col}
            isMine={brick.isMine}
            isDiscovered={brick.isDiscovered}
            isWhat={brick.isWhat}
            isFlagged={brick.isFlagged}
            neighborMinesCount={brick.neighborMinesCount}
            isGameLost={brick.isGameLost}
            onClick={() => {
              this.onClickHandle(brick)
            }}
            onContextMenu={(e) => {
              this.onContextMenuHandle(e, brick)
            }}
          />
          {brick.col === this.props.width - 1 ? <div className="end-row"/> : ""}
        </div>
      )
    )
  };

  render() {
    return <div className="game container">
      <div className='game__control'>
        <div className='game__flag'>
          {zeroPad(this.state.minesLeft)}
        </div>
        <button className="game__btn" onClick={() => this.props.restart()}>
          <img className="game__smile" src={`${this.gameStatus()}`} alt=""/>
        </button>
        <div className='game__time'>
          {zeroPad(this.state.seconds, 4)}
        </div>
      </div>
      <div className="game__mine">
          {this.renderBricks(this.state.bricksInGame)}
      </div>
    </div>
  }
}

export default MineField;
