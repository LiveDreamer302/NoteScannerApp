import React, { useState } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    Image,
    TouchableOpacity,
    TextInput,
    ImageBackground,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useNotes } from '../context/NotesContext';
import * as ImagePicker from 'expo-image-picker';

const NOTES_PER_PAGE = 10;

const HomeScreen = () => {
    const navigation = useNavigation();
    const { notes, deleteNote, editNote, backgroundImage, updateBackgroundImage } = useNotes();
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [editingIndex, setEditingIndex] = useState(null);
    const [editText, setEditText] = useState('');

    const filteredNotes = notes.filter(
        (note) =>
            note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            note.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const totalPages = Math.ceil(filteredNotes.length / NOTES_PER_PAGE);
    const paginatedNotes = filteredNotes.slice(
        (currentPage - 1) * NOTES_PER_PAGE,
        currentPage * NOTES_PER_PAGE
    );

    const startEditing = (index, currentTitle) => {
        setEditingIndex(index);
        setEditText(currentTitle);
    };

    const saveEdit = (index) => {
        editNote(index, { title: editText });
        setEditingIndex(null);
        setEditText('');
    };

    const cancelEdit = () => {
        setEditingIndex(null);
        setEditText('');
    };

    const pickBackgroundImage = async () => {
       let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        console.log(result);

        if (!result.canceled) {
            updateBackgroundImage(result.assets[0].uri);
        }
    };

    return (
        <ImageBackground
            source={backgroundImage ? { uri: backgroundImage } : null}
            style={styles.background}
        >
            <View style={styles.container}>
                <Text style={styles.title}>Note Scanner</Text>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Caută după titlu sau etichete..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                <TouchableOpacity
                    style={styles.scanButton}
                    onPress={() => navigation.navigate('Camera')}
                >
                    <Text style={styles.scanButtonText}>Scanează o notiță</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.backgroundButton} onPress={pickBackgroundImage}>
                    <Text style={styles.buttonText}>Alege fundal din galerie</Text>
                </TouchableOpacity>

                <FlatList
                    data={paginatedNotes}
                    keyExtractor={(item, index) => `${index}-${currentPage}`}
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
                                            onPress={() => saveEdit(notes.indexOf(item))}
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
                                    <View style={styles.textContainer}>
                                        <Text style={styles.noteTitle}>{item.title}</Text>
                                        <Text style={styles.tags}>
                                            {item.tags.length > 0
                                                ? `Etichete: ${item.tags.join(', ')}`
                                                : 'Fără etichete'}
                                        </Text>
                                    </View>
                                    <View style={styles.actionButtons}>
                                        <TouchableOpacity
                                            style={styles.editButton}
                                            onPress={() =>
                                                startEditing(notes.indexOf(item), item.title)
                                            }
                                        >
                                            <Text style={styles.buttonText}>Editează</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={styles.deleteButton}
                                            onPress={() => deleteNote(notes.indexOf(item))}
                                        >
                                            <Text style={styles.buttonText}>Șterge</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )}
                        </View>
                    )}
                    ListEmptyComponent={
                        <Text style={styles.empty}>Nu ai notițe care să corespundă căutării.</Text>
                    }
                />

                {totalPages > 1 && (
                    <View style={styles.pagination}>
                        <TouchableOpacity
                            style={[styles.pageButton, currentPage === 1 && styles.disabledButton]}
                            onPress={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            <Text style={styles.pageButtonText}>Înapoi</Text>
                        </TouchableOpacity>
                        <Text style={styles.pageInfo}>
                            Pagina {currentPage} din {totalPages}
                        </Text>
                        <TouchableOpacity
                            style={[
                                styles.pageButton,
                                currentPage === totalPages && styles.disabledButton,
                            ]}
                            onPress={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                        >
                            <Text style={styles.pageButtonText}>Înainte</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    background: { flex: 1 },
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: 'rgba(245, 245, 245, 0.8)',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
        textAlign: 'center',
    },
    searchInput: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 8,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    scanButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 15,
    },
    backgroundButton: {
        backgroundColor: "#357546",
        paddingVertical: 10,
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
        elevation: 3,
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
    textContainer: {
        flex: 1,
        marginRight: 10,
    },
    noteTitle: {
        fontSize: 16,
        color: '#333',
        marginBottom: 5,
    },
    tags: {
        fontSize: 14,
        color: '#666',
        fontStyle: 'italic',
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
    pagination: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
    },
    pageButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 5,
    },
    disabledButton: {
        backgroundColor: '#ccc',
    },
    pageButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    pageInfo: {
        fontSize: 16,
        color: '#333',
    },
});

export default HomeScreen;