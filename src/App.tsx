import React from 'react';
import StickyNotes from "./modules/StickyNotes/StickyNotes";
import './styles/App.css';
import BoardContextProvider from "./modules/StickyNotes/BoardContext";

function App() {
    return <BoardContextProvider>
        <StickyNotes />
    </BoardContextProvider>
}

export default App;
