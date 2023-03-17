//


import * as React from 'react';

import * as Yt from './Yt';


function AddInput({dispatch}) {
  const PLACEHOLDER = 'https://www.youtube.com/watch?v=jNQXAC9IVRw';

  const dialogId = React.useId();
  const formId = React.useId();

  function handleFormSubmit(e) {
    const url = new FormData(e.target).get('url');
    dispatch({
      type: 'add',
      url,
    });
  }

  function handleAddButtonClick(e) {
    document.getElementById(dialogId).showModal();
  }

  function handleCancelButtonClick(e) {
    document.getElementById(dialogId).close();
  }

  function handleDialogClose(e) {
    document.getElementById(formId).reset();
  }

  return (
    <>
    <dialog id={dialogId} onClose={handleDialogClose}>
    <form id={formId} method='dialog' onSubmit={handleFormSubmit}>
    <p>
    <label>
    Add URL:
    <input autoFocus name='url' pattern={Yt.PATTERN} placeholder={PLACEHOLDER} required title='URL' type='url' />
    </label>
    </p>
    <p>
    <button onClick={handleCancelButtonClick} type='button'>Cancel</button>
    <button type='submit'>Add</button>
    </p>
    </form>
    </dialog>
    <button onClick={handleAddButtonClick} type='button'>Add...</button>
    </>
  );
}

function PlaylistRow({dispatch, track, position}) {

  function handleDelete(e) {
    dispatch({
      type: 'delete',
      uuid: track.uuid,
    });
    e.preventDefault();
  }

  function handleDown(e) {
    move(position + 1, position);
    e.preventDefault();
  }

  function handleUp(e) {
    move(position - 1, position);
    e.preventDefault();
  }

  function handleTop(e) {
    move(0, position);
    e.preventDefault();
  }

  function handleBottom(e) {
    move(-1, position);
    e.preventDefault();
  }

  function move(newPosition, oldPosition) {
    if (newPosition !== oldPosition) {
      dispatch({
        type: 'move',
        newPosition,
        oldPosition,
      });
    }
  }

  function dragStart(e) {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', JSON.stringify({position}));
  }

  function getDragData(e) {
    let value = null;
    if (e.dataTransfer.effectAllowed === 'move') {
      if (e.dataTransfer.types.includes('text/plain')) {
        const blob = e.dataTransfer.getData('text/plain');
        let data = null;
        try {
          data = JSON.parse(blob);
        } catch (err) {
          data = null;
        }
        if (data !== null && data.hasOwnProperty('position')) {
          value = data.position;
        }
      }
    }
    return value;
  }

  function dragOver(e) {
    if (getDragData(e) !== null) {
      e.dataTransfer.dropEffect = 'move';
      e.preventDefault();
    }
  }

  function drop(e) {
    const oldPosition = getDragData(e);
    if (oldPosition !== null) {
      move(position, oldPosition);
      e.preventDefault();
    }
  }

  const url = Yt.getUrl(track.vid);

  return (
    <tr draggable={true} onDragStart={dragStart} onDragOver={dragOver} onDrop={drop}>
    <td><a href={url}><samp>{track.vid}</samp></a></td>
    <td>#{position + 1}</td>
    <td>
    <button type='button' onClick={handleDelete}>Delete</button>
    <button type='button' onClick={handleTop}>Top</button>
    <button type='button' onClick={handleUp}>Up</button>
    <button type='button' onClick={handleDown}>Down</button>
    <button type='button' onClick={handleBottom}>Bottom</button>
    </td>
    </tr>
  );
}

function PlaylistTable({list, dispatch}) {
  const rows = [];
  let position = 0;

  list.forEach((track) => {
    rows.push(
      <PlaylistRow
      track={track}
      dispatch={dispatch}
      key={track.uuid}
      position={position}/>
    );
    ++position;
  });

  return (
    <table>
    <caption>Playlist</caption>
    <thead>
    <tr>
    <th scope='col'>URL</th>
    <th scope='col'>Position</th>
    <th scope='col'>Edit</th>
    </tr>
    </thead>
    <tbody>{rows}</tbody>
    <tfoot>
    <tr>
    <td colSpan={3}>
    <AddInput dispatch={dispatch} />
    </td>
    </tr>
    </tfoot>
    </table>
  );
}

function reducer(list, action) {
  switch (action.type) {
    case 'add': {
      return addTrack(list, action.url);
    }
    case 'delete': {
      return deleteTrack(list, action.uuid);
    }
    case 'move': {
      return moveTrack(list, action.newPosition, action.oldPosition);
    }
    default: {
      throw Error(`Unknown action: ${action.type}`);
    }
  }
}

function addTrack(list, url) {
  let newList = null;
  const vid = Yt.getVid(url);
  if (vid !== null) {
    newList = [...list, {uuid: crypto.randomUUID(), vid}];
  } else {
    newList = list;  // return current state to skip unnecessary re-rendering
  }
  return newList;
}

function deleteTrack(list, uuid) {
  return list.filter(track => track.uuid !== uuid);
}

function moveTrack(list, newPosition, oldPosition) {
  let newList = null;
  if (newPosition < 0) {
    // Move to bottom
    newList = [
      ...list.slice(0, oldPosition),
      ...list.slice(oldPosition + 1),
      list[oldPosition],
    ];
  } else if (newPosition < oldPosition) {
    newList = [
      ...list.slice(0, newPosition),
      list[oldPosition],
      ...list.slice(newPosition, oldPosition),
      ...list.slice(oldPosition + 1),
    ];
  } else if (newPosition > oldPosition) {
    newList = [
      ...list.slice(0, oldPosition),
      ...list.slice(oldPosition + 1, newPosition + 1),
      list[oldPosition],
      ...list.slice(newPosition + 1),
    ];
  }
  return newList;
}

const initialList = [
  'jNQXAC9IVRw',
];

function listInitializer(vids) {
  return vids.map((vid) => ({
    uuid: crypto.randomUUID(),
    vid,
  }));
}

function App() {
  const [list, dispatch] = React.useReducer(reducer, initialList, listInitializer);

  return (
    <>
    <h1>Pledit</h1>
    <PlaylistTable list={list} dispatch={dispatch} />
    <Yt.PlaylistEmbed list={list} dispatch={dispatch} />
    </>
  );
}

export default App;


// EOF
