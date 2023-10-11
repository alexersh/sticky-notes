import React, {createContext, useContext, useEffect, useState} from "react";

type TNoteType = {x: number, y: number, color: string, text: string};

type TBoardContextState = {
    notes: Map<number, TNoteType>
    isNewNote: boolean,
};

type TUpdateStateFn = (updatedState: Partial<TBoardContextState>) => void;

type TBoardContextContextType =
    | {
    state: TBoardContextState;
    updateState: TUpdateStateFn;
    saveStateToLocalStorage: () => void,
}
    | undefined;

const BoardContext = createContext<TBoardContextContextType>(undefined);

const initialState: TBoardContextState = {
    notes: new Map(),
    isNewNote: false,
};

const BoardContextProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [state, setState] = useState(initialState);

    const updateState: TUpdateStateFn = (updatedState) => {
        setState((prevState) => ({
            ...prevState,
            ...updatedState,
        }));
    };

    const saveStateToLocalStorage = () => {
        window.localStorage.setItem('notes', JSON.stringify(Array.from(state.notes.values())))
    }

    useEffect(() => {
        const notesFromStorage = window.localStorage.getItem('notes');

        if(notesFromStorage) {
            const mapFromStorage = new Map();
            (JSON.parse(notesFromStorage) as TNoteType[]).forEach((note, index) => {
                mapFromStorage.set(index+1, note);
            })
            updateState({notes: mapFromStorage});
        }
    }, []);


    return <BoardContext.Provider value={{state, updateState, saveStateToLocalStorage}}>{children}</BoardContext.Provider>;
};

export const useBoardContextContext = () => {
    const context = useContext(BoardContext);
    if (!context) {
        throw new Error('useBoardContextContext must be used within an BoardContextProvider.');
    }
    return context;
};

export default BoardContextProvider;