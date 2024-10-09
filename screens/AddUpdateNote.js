import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useRoute, useNavigation } from '@react-navigation/native';

function AddUpdateNote() {
    const [content, setContent] = useState('');
    const [isContentFocused, setIsContentFocused] = useState(false);
    const route = useRoute();
    const navigation = useNavigation();

    const userName = route.params?.userName || 'User';

    const handleSubmit = async () => {
        if (content.trim() === '') {
            Alert.alert('Please enter some content for the note.');
            return;
        }
    
        try {
            const response = await axios.get('https://6705d8bb031fd46a83111f3b.mockapi.io/notes');
            const newNoteId = response.data.length ? (parseInt(response.data[response.data.length - 1].id) + 1).toString() : "1";
            
            const newNote = { id: newNoteId, content };
            const result = await axios.post('https://6705d8bb031fd46a83111f3b.mockapi.io/notes', newNote);
    
            Alert.alert('Note added successfully');
    
            navigation.navigate('NoteList', {
                newNote: result.data, 
                userName
            });
    
            setContent('');
        } catch (error) {
            console.error(error);
            Alert.alert('Failed to add the note');
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
                <Image source={require('../assets/ava1.png')} style={styles.profilePic} />
                <Text style={styles.greeting}>Hi {userName}</Text>
                <Text style={styles.subGreeting}>Have a great day ahead!</Text>
            </View>

            <Text style={styles.title}>ADD YOUR JOB</Text>

            <View style={[styles.inputContainer, isContentFocused && styles.inputContainerFocused]}>
                <Ionicons name="document-outline" size={24} color="green" />
                <TextInput
                    placeholder="Input your job"
                    placeholderTextColor="#aaa"
                    value={content}
                    onChangeText={setContent}
                    onFocus={() => setIsContentFocused(true)}
                    onBlur={() => setIsContentFocused(false)}
                    style={styles.input}
                />
            </View>

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>FINISH →</Text>
            </TouchableOpacity>

            <Image source={require('../assets/image95.png')} style={styles.bottomImage} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 30,
    },
    header: {
        alignItems: 'center',
        marginBottom: 20,
    },
    profilePic: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: 10,
    },
    greeting: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
    },
    subGreeting: {
        fontSize: 16,
        color: '#666',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
        textAlign: 'center',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 5,
        width: '100%',
        marginBottom: 20,
        backgroundColor: '#fff',
    },
    inputContainerFocused: {
        borderColor: 'green',
        borderWidth: 1,
    },
    input: {
        flex: 1,
        padding: 10,
        fontSize: 16,
        outlineWidth: 0,
    },
    button: {
        backgroundColor: '#00BDD6',
        paddingVertical: 15,
        width: '100%',  // Changed to 100% for full width
        borderRadius: 10,
        marginBottom: 30,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    bottomImage: {
        width: 150,
        height: 150,
        resizeMode: 'contain',
        marginTop: 20,
    },
});

export default AddUpdateNote;
