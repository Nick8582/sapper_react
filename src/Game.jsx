import React from "react";
import MineField from './components/main/MineFiled';
import defaultImg from './images/smile-default.png';
import winImg from './images/smile-win.png';
import loseImg from './images/smile-lose.png'
import './Game.css'

const zeroPad = (num, places) => String(num).padStart(places, '0');

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      height: 16,
      width: 16,
      mines: 10,
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

  updateData = (img) => {
    this.setState({image: img})
  }

  newGame() {
    this.setState({
      gamePlayedCount: this.state.gamePlayedCount + 1,
    });
  }

  render() {
    const {height, width, mines} = this.state;
    return (
      <div className='game container'>
        <div className='game__control'>
          <div className='game__flag'>
            {zeroPad(0)}
          </div>
          <button className="game__btn" onClick={()=> this.newGame()}>
            <img className="game__smile" src={`${this.updateData}`} alt=""/>
          </button>
          <div className='game__time'>
            {zeroPad(2400, 4)}
          </div>
        </div>

        <MineField
          key={this.state.gamePlayedCount}
          height={height}
          width={width}
          mines={mines}
          image={this.updateData}
        />
      </div>
    );
  }
}

export default Game;
