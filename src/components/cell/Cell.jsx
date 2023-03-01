import React from 'react';


let Cell = (props) => {
  const bombEmoji = "☣️";
  const explosionEmoji = "👾️";
  const flagEmoji = "🚩";
  const falseFlagEmoji = "❌";
  const whatEmoji = "?";
  const {neighborMinesCount, isMine, isDiscovered, isFlagged, isWhat} = props;
  const className = props.isDiscovered ?
    `square square-revealed square-${props.neighborMinesCount}` :
    "square";

  function getGameOverDisplayedIcon() {
    if (isFlagged && isMine) {
      return flagEmoji;
    } else if (isFlagged && !isMine) {
      return falseFlagEmoji;
    } else if (isMine && isDiscovered) {
      return explosionEmoji;
    } else if (isMine) {
      return bombEmoji;
    } else {
      return neighborMinesCount;
    }
  }

  function getDisplayedValue() {
    if (isDiscovered && isMine) {
      return explosionEmoji;
    } else if (isFlagged) {
      return flagEmoji;
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
    onContextMenu={props.onContextMenu}>
    {props.isGameLost ? getGameOverDisplayedIcon() : getDisplayedValue()}
  </button>
}


export default Cell;
