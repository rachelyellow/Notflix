import React from 'react';


function MainMenu(props) {

  const allActions = ["list all movies", "movies by genre", "my movies", "check credit", "purchase"];

  return (
    <div className="MainMenu">
        {allActions.map(action => <div key={action} className="menu-item" onClick={() => props.chooseAction(action)}>{props.capitalize(action)}</div>)}
    </div>
  );
}

export default MainMenu;