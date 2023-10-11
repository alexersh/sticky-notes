import React, {useRef, useState, MouseEvent, useEffect} from 'react';
import {useBoardContextContext} from "../modules/StickyNotes/BoardContext";

interface NoteProps {
    containerRef: React.RefObject<HTMLDivElement>;
    trashRef: React.RefObject<HTMLDivElement>;
    noteId: number,
}

const Note: React.FC<NoteProps> = ({ containerRef, trashRef, noteId  }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const elementRef = useRef<HTMLDivElement>(null);
    const {updateState, saveStateToLocalStorage, state: {notes}} = useBoardContextContext()
    let noteData = notes.get(noteId);

    const [isEditing, setIsEditing] = useState(false);
    const [newText, setNewText] = useState(noteData?.text || '');

    useEffect(() => {
        if(elementRef.current && noteData) {
            elementRef.current.style.left = noteData.x + 'px';
            elementRef.current.style.top = noteData.y + 'px';
        }
    }, []);

    const handleMouseDown = (e: MouseEvent) => {
        if(!isEditing) {
            e.preventDefault();
            setIsDragging(true);
            const element = elementRef.current;
            if (!element) return;
            const rect = element.getBoundingClientRect();
            setOffset({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            });
        }
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging || !containerRef.current || isEditing) return;
        const element = elementRef.current;
        if (!element) return;

        const containerRect = containerRef.current.getBoundingClientRect();
        const maxX = containerRect.width - element.offsetWidth;
        const maxY = containerRect.height - element.offsetHeight;
        const x = Math.min(maxX, Math.max(0, e.clientX - containerRect.left - offset.x));
        const y = Math.min(maxY, Math.max(0, e.clientY - containerRect.top - offset.y));

        if(noteData) {
            noteData.x = x;
            noteData.y = y;
        }
        element.style.left = x + 'px';
        element.style.top = y + 'px';

        // Check if the element is over the trash zone and delete it
        if (trashRef.current) {
            // Calculate the positions of the center of the element and the center of the trash zone
            const elementCenterX = x + element.offsetWidth / 2;
            const elementCenterY = y + element.offsetHeight / 2;

            const trashRect = trashRef.current.getBoundingClientRect();
            const trashCenterX = trashRect.left + trashRect.width / 2;
            const trashCenterY = trashRect.top + trashRect.height / 2;

            const isOverTrash =
                Math.abs(elementCenterX - trashCenterX) <= trashRect.width / 2 &&
                Math.abs(elementCenterY - trashCenterY) <= trashRect.height / 2;
            if (isOverTrash) {
                // Delete item
                notes.delete(noteId)
                updateState({notes})
                saveStateToLocalStorage();
            }
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        if(noteData) {
            notes.set(noteId, noteData);
            updateState({notes})
        }
        saveStateToLocalStorage();
    };

    const handleMouseLeave = () => {
        if(isEditing && noteData) {
            noteData.text = newText;
            notes.set(noteId, noteData);
            updateState({notes})
            saveStateToLocalStorage();
        }
        setIsEditing(false)
        setIsDragging(false); // Remove dragging when the cursor leaves the parent div
    };

    return (
        <div
            ref={elementRef}
            className="note"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onDoubleClick={() => setIsEditing(true)}
            style={{backgroundColor: noteData?.color}}
        >
            {isEditing ?
                <input
                    value={newText}
                    onChange={(e) => setNewText(e.target.value)}
                    onKeyDown={(e) => {
                        if(e.key === 'Enter') {
                            handleMouseLeave()
                        }
                    }}/>
                : noteData?.text}
        </div>
    );
};

export default Note;