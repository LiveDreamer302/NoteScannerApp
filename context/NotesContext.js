import React, { createContext, useState, useContext } from 'react';

const NotesContext = createContext();

export const NotesProvider = ({ children }) => {
    const [notes, setNotes] = useState([]);
    const [backgroundImage, setBackgroundImage] = useState(null);

    const addNote = (note) => {
        setNotes((prev) => [{ ...note, tags: note.tags || [] }, ...prev]);
    };

    const deleteNote = (index) => {
        setNotes((prev) => prev.filter((_, i) => i !== index));
    };

    const editNote = (index, updatedNote) => {
        setNotes((prev) =>
            prev.map((note, i) => (i === index ? { ...note, ...updatedNote } : note))
        );
    };

    const updateBackgroundImage = (uri) => {
        setBackgroundImage(uri);
    };

    return (
        <NotesContext.Provider
            value={{ notes, addNote, deleteNote, editNote, backgroundImage, updateBackgroundImage }}
        >
            {children}
        </NotesContext.Provider>
    );
};

export const useNotes = () => {
    return useContext(NotesContext);
};