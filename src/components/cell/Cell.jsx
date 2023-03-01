import React from 'react';
import bomb from '../../images/bomb.png';
import bombDef from '../../images/bomb-def.png';
import flag from '../../images/flag.png';

let Cell = (props) => {
  const whatEmoji = "?";
  const {neighborMinesCount, isMine, isDiscovered, isFlagged, isWhat} = props;
  const className = props.isDiscovered ?
    `square square-revealed square-${props.neighborMinesCount}` :
    "square";

  function getGameOverDisplayedIcon() {
    if (isFlagged && isMine) {
      return <img src={flag} className='game__smile'/>;
    } else if (isFlagged && !isMine) {
      return <img src={bombDef} className='game__smile'/>;
    } else if (isMine && isDiscovered) {
      return <img src={bomb} className='game__smile game__smile--red'/>;
    } else if (isMine) {
      return <img src={bomb} className='game__smile'/>;
    } else {
      return neighborMinesCount;
    }
  }

  function getDisplayedValue() {
    if (isDiscovered && isMine) {
      return <img src={bomb} className='game__smile red'/>;
    } else if (isFlagged) {
      return <img src={flag} className='game__smile'/>;
    } else if (isWhat) {
      return whatEmoji;
    } else if (isDiscovered) {
      return neighborMinesCount;
    } else {
      return null;
    }
  }
  return <button
    className={className}
    onClick={props.onClick}
    onContextMenu={props.onContextMenu}
    onMouseDown={props.isMouseDown}
    onMouseUp={props.isMouseUp}
    >
    {props.isGameLost ? getGameOverDisplayedIcon() : getDisplayedValue()}
  </button>
}


export default Cell;
