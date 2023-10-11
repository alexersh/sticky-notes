import React, {useRef} from 'react';
import Note from "./Note";
import {useBoardContextContext} from "../modules/StickyNotes/BoardContext";

const Board = () => {
    const {state: {notes}, updateState} = useBoardContextContext();
    const boardRef = useRef<HTMLDivElement>(null);
    const trashRef = useRef<HTMLDivElement>(null);

    return (
        <>
            <button type='button' className='new-note-button' onClick={() => updateState({isNewNote: true})}>+</button>
            <div ref={trashRef} className="trash-zone" />
            <div className='board' ref={boardRef}>
                {Array.from(notes).map(([id, {x,y,color,text}])=> {
                    return <Note key={id} trashRef={trashRef} containerRef={boardRef} noteId={id} />
                })}
            </div>
        </>
    );
};

export default Board;