import React, { useState } from 'react';
import {
    View,
    Text,
    Button,
    FlatList,
    StyleSheet,
    Image,
    TouchableOpacity,
    TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useNotes } from '../context/NotesContext';

const HomeScreen = () => {
    const navigation = useNavigation();
    const { notes, deleteNote, editNote } = useNotes();
    const [editingIndex, setEditingIndex] = useState(null); // Track which note is being edited
    const [editText, setEditText] = useState(''); // Temporary state for editing text

    const startEditing = (index, currentTitle) => {
        setEditingIndex(index);
        setEditText(currentTitle);
    };

    const saveEdit = (index) => {
        editNote(index, { title: editText });
        setEditingIndex(null); // Exit editing mode
        setEditText('');
    };

    const cancelEdit = () => {
        setEditingIndex(null);
        setEditText('');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Note Scanner</Text>
            <TouchableOpacity
                style={styles.scanButton}
                onPress={() => navigation.navigate('Camera')}
            >
                <Text style={styles.scanButtonText}>Scanează o notiță</Text>
            </TouchableOpacity>
            <FlatList
                data={notes}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => (
                    <View style={styles.noteItem}>
                        <Image source={{ uri: item.uri }} style={styles.image} />
                        {editingIndex === index ? (
                            <View style={styles.editContainer}>
                                <TextInput
                                    style={styles.editInput}
                                    value={editText}
                                    onChangeText={setEditText}
                                    autoFocus
                                />
                                <View style={styles.editButtons}>
                                    <TouchableOpacity
                                        style={styles.saveButton}
                                        onPress={() => saveEdit(index)}
                                    >
                                        <Text style={styles.buttonText}>Salvează</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.cancelButton}
                                        onPress={cancelEdit}
                                    >
                                        <Text style={styles.buttonText}>Anulează</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ) : (
                            <View style={styles.noteContent}>
                                <Text style={styles.noteTitle}>{item.title}</Text>
                                <View style={styles.actionButtons}>
                                    <TouchableOpacity
                                        style={styles.editButton}
                                        onPress={() => startEditing(index, item.title)}
                                    >
                                        <Text style={styles.buttonText}>Editează</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.deleteButton}
                                        onPress={() => deleteNote(index)}
                                    >
                                        <Text style={styles.buttonText}>Șterge</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                    </View>
                )}
                ListEmptyComponent={<Text style={styles.empty}>Nu ai notițe salvate.</Text>}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5', // Light gray background
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
        textAlign: 'center',
    },
    scanButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 20,
    },
    scanButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    noteItem: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        marginVertical: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3, // For Android shadow
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginBottom: 10,
    },
    noteContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    noteTitle: {
        fontSize: 16,
        color: '#333',
        flex: 1,
    },
    actionButtons: {
        flexDirection: 'row',
    },
    editButton: {
        backgroundColor: '#FFA500',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 5,
        marginLeft: 10,
    },
    deleteButton: {
        backgroundColor: '#FF3B30',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 5,
        marginLeft: 10,
    },
    editContainer: {
        marginTop: 10,
    },
    editInput: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        padding: 8,
        fontSize: 16,
        marginBottom: 10,
    },
    editButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    saveButton: {
        backgroundColor: '#34C759',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 5,
    },
    cancelButton: {
        backgroundColor: '#FF9500',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    empty: {
        marginTop: 20,
        fontStyle: 'italic',
        color: '#666',
        textAlign: 'center',
    },
});

export default HomeScreen;