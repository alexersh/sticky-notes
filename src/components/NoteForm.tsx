import React, {useState} from 'react';
import {useBoardContextContext} from "../modules/StickyNotes/BoardContext";

const generateRandomColor = () => {
    const randomColor = Math.floor(Math.random()*16777215).toString(16);
    return `#${randomColor}`;
}

const NoteForm = () => {
    const [text, setText] = useState('Sample text');
    const [color, setColor] = useState(generateRandomColor());
    const {updateState, state: {notes, isNewNote}} = useBoardContextContext()

    if(!isNewNote) {
    }

    return (
            <form onSubmit={(e) => {
                const notesTemp = notes;

                notesTemp.set(notes.size+1, {x: 0, y: 0, text, color});
                updateState({ notes: notesTemp, isNewNote: false });

                e.preventDefault();
            }} className='formContainer' >
                <div className='form'>
                    <div className='form-block'>
                        <label htmlFor='text-input'>Type text</label>
                        <input id='text-input' type='text' value={text} onChange={(e) => setText(e.target.value)} />
                    </div>
                    <div className='form-block'>
                        <label htmlFor='text-input'>Select color</label>
                        <input type='color' value={color} onChange={(e) => setColor(e.target.value)} />
                    </div>
                    <input type='submit' value='Submit' />
                </div>
            </form>
    );
};

export default NoteForm;