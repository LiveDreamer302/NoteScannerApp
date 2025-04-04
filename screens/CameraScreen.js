import React, { useRef, useState } from 'react';
import { View, Button, StyleSheet, TextInput, Text, TouchableOpacity } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import { useNotes } from '../context/NotesContext';

const CameraScreen = () => {
    const cameraRef = useRef(null);
    const [title, setTitle] = useState('');
    const [tags, setTags] = useState(''); // Tags as comma-separated string
    const [permission, requestPermission] = useCameraPermissions();
    const { addNote } = useNotes();
    const navigation = useNavigation();

    if (!permission) return <View />;
    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={styles.message}>Avem nevoie de permisiunea ta pentru a folosi camera</Text>
                <Button onPress={requestPermission} title="Acordă permisiune" />
            </View>
        );
    }

    const takePicture = async () => {
        if (cameraRef.current) {
            const photo = await cameraRef.current.takePictureAsync();
            const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag); // Convert to array
            addNote({ uri: photo.uri, title, tags: tagsArray });
            navigation.goBack();
        }
    };

    return (
        <View style={styles.container}>
            <CameraView style={styles.camera} facing={"back"} ref={cameraRef}>
                <View style={styles.buttonContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Titlu notiță"
                        value={title}
                        onChangeText={setTitle}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Etichete (separate prin virgulă)"
                        value={tags}
                        onChangeText={setTags}
                    />
                    <TouchableOpacity style={styles.button} onPress={takePicture}>
                        <Text style={styles.text}>Salvează Notița</Text>
                    </TouchableOpacity>
                </View>
            </CameraView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center' },
    message: { textAlign: 'center', paddingBottom: 10 },
    camera: { flex: 1 },
    buttonContainer: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'transparent',
        margin: 20,
        justifyContent: 'flex-end',
    },
    button: {
        alignSelf: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
    },
    text: { fontSize: 18, fontWeight: 'bold', color: '#000' },
    input: {
        padding: 10,
        backgroundColor: '#fff',
        marginBottom: 10,
        borderRadius: 5,
    },
});

export default CameraScreen;