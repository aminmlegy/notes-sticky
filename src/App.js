import React, { useState, useReducer, useEffect } from "react";
import uuid from "react-uuid";
import "./App.css";
import Swal from "sweetalert2";
const initialState = {
  noteCount: 0,
  notes: [],
};

const noteReducer = (prevState, action) => {
  switch (action.type) {
    case "ADD_NOTE":
      const newState = {
        noteCount: prevState.notes.length + 1,
        notes: [...prevState.notes, action.payload],
      };
      return newState;
    case "DELETE_NOTE": {
      const newState = {
        noteCount: prevState.notes.length - 1,
        notes: prevState.notes.filter((note) => note.id !== action.payload.id),
      };
      return newState;
    }
    default:
      console.log("helllo");
  }
};

export default function App() {
  const [inputData, setInputData] = useState("");
  const [listNotes, dispatch] = useReducer(
    noteReducer,
    JSON.parse(localStorage.getItem("notesInfo")) || initialState
  );

  const addNote = (e) => {
    e.preventDefault();
    if (!inputData) {
      return;
    }
    const newNote = {
      id: uuid(),
      text: inputData,
      noteDate: new Date().toTimeString().slice(0, 8),
      rotate: Math.floor(Math.random() * 30),
    };
    dispatch({ type: "ADD_NOTE", payload: newNote });
    setInputData("");
  };

  const dragNote = (e) => {
    e.target.style.left = `${e.pageX - 50}px`;
    e.target.style.top = `${e.pageY - 50}px`;
  };

  const dragApp = (e) => {
    e.stopPropagation();
    e.preventDefault();
  };

  useEffect(() => {
    localStorage.setItem("notesInfo", JSON.stringify(listNotes));
  }, [listNotes]);
  const deleteNote = (note) => {
    Swal.fire({
      title: `Are You Sure?`,
      showCancelButton: true,
    }).then((res) => {
      res.isConfirmed && dispatch({ type: "DELETE_NOTE", payload: note });
    });
  };
  return (
    <div className='app' onDragOver={dragApp}>
      <h1>
        Sticky Notes ({listNotes.noteCount})
        <span>
          {listNotes.noteCount > 0
            ? `Last Not Created ${listNotes.notes.at(-1).noteDate}`
            : ""}
        </span>
      </h1>
      <form onSubmit={addNote} className='note-form'>
        <textarea
          value={inputData}
          onChange={(e) => setInputData(e.target.value)}
          placeholder='Create a new note.....'></textarea>
        <button type='submit'>Add</button>
      </form>
      {listNotes.notes.map((note) => {
        return (
          <div
            className='note'
            style={
              listNotes.notes.at(-1).id === note.id
                ? {
                    transform: `rotate(${note.rotate}deg)`,
                  }
                : { transform: `rotate(${note.rotate}deg)` }
            }
            draggable='true'
            onDragEnd={dragNote}
            key={note.id}>
            <div onClick={() => deleteNote(note)} className='close'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 20 20'
                fill='currentColor'>
                <path
                  fillRule='evenodd'
                  d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                  clipRule='evenodd'
                />
              </svg>
            </div>
            <pre className='text'>
              {note.text}

              {listNotes.notes.at(-1).id === note.id ? (
                <span className='lastNote'>
                  {" "}
                  {listNotes.notes.at(-1).noteDate}
                </span>
              ) : (
                ""
              )}
            </pre>
          </div>
        );
      })}
    </div>
  );
}
