import React from 'react';

function BackButton(props) {
  return (
    <button className="main-menu-button" onClick={() => props.chooseAction(null)} >MAIN MENU</button>
  );
}


export default BackButton;
