import React from 'react';
import {useBoardContextContext} from "./BoardContext";
import Board from "../../components/Board";
import NoteForm from "../../components/NoteForm";
import '../../styles/StickyNotesModule.css';

const StickyNotes = () => {
    const {state: {isNewNote}} = useBoardContextContext()

    return (
        <>
            <Board />
            {isNewNote && <NoteForm />}
        </>
    );
};

export default StickyNotes;