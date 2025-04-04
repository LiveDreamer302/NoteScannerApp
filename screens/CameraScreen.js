import React, { useRef, useState } from 'react';
import { View, Button, StyleSheet, TextInput, Text, TouchableOpacity } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import { useNotes } from '../context/NotesContext';

const CameraScreen = () => {
    const cameraRef = useRef(null);
    const [title, setTitle] = useState('');
    const [permission, requestPermission] = useCameraPermissions();
    const { addNote } = useNotes();
    const navigation = useNavigation();

    // Permissions still loading
    if (!permission) {
        return <View />;
    }

    // Permissions not granted
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
            addNote({ uri: photo.uri, title });
            navigation.goBack();
        }
    };

    return (
        <View style={styles.container}>
            <CameraView
                style={styles.camera}
                facing={"back"} // Fixed to back-facing camera
                ref={cameraRef}
            >
                <View style={styles.buttonContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Titlu notiță"
                        value={title}
                        onChangeText={setTitle}
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
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    message: {
        textAlign: 'center',
        paddingBottom: 10,
    },
    camera: {
        flex: 1,
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'column', // Stack input and button vertically
        backgroundColor: 'transparent',
        margin: 20, // Adjusted margin to fit better
        justifyContent: 'flex-end', // Align items at the bottom
    },
    button: {
        alignSelf: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
    },
    text: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },
    input: {
        padding: 10,
        backgroundColor: '#fff',
        marginBottom: 10,
        borderRadius: 5,
    },
});

export default CameraScreen;