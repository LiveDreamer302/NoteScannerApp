import React, { createContext, useState, useContext } from 'react';

const NotesContext = createContext();

export const NotesProvider = ({ children }) => {
    const [notes, setNotes] = useState([]);

    const addNote = (note) => {
        setNotes((prev) => [note, ...prev]);
    };

    const deleteNote = (index) => {
        setNotes((prev) => prev.filter((_, i) => i !== index));
    };

    const editNote = (index, updatedNote) => {
        setNotes((prev) =>
            prev.map((note, i) => (i === index ? { ...note, ...updatedNote } : note))
        );
    };

    return (
        <NotesContext.Provider value={{ notes, addNote, deleteNote, editNote }}>
            {children}
        </NotesContext.Provider>
    );
};

export const useNotes = () => {
    return useContext(NotesContext);
};