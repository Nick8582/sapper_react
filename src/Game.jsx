import React from "react";
import MineField from './components/main/MineFiled';
import './Game.css'


class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      height: 16,
      width: 16,
      mines: 40,
      gamePlayedCount: 0,
      isGameLose: 0,
      isGameWin: 0,
    }
  }

  // Для меню настроек сложности
  // createGame(ev) {
  //   const [height, width, mines] = ev.target.value(',').map(x => parseInt(x));
  //   this.state({
  //     height,
  //     width,
  //     mines,
  //     gamePlayedCount: this.state.gamePlayedCount + 1,
  //   });
  // }

  newGame = () => {
    this.setState({
      gamePlayedCount: this.state.gamePlayedCount + 1,
    });
  }

  render() {
    const {height, width, mines} = this.state;
    return (
      <div className=''>
        <MineField
          key={this.state.gamePlayedCount}
          height={height}
          width={width}
          mines={mines}
          restart={this.newGame}
          seconds='2400'
        />
      </div>
    );
  }
}

export default Game;
