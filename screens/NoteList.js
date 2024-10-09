import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
  Pressable,
  Alert,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import { useRoute, useNavigation } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

function NoteList() {
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [noteToEdit, setNoteToEdit] = useState(null);
  const [editedContent, setEditedContent] = useState('');
  const route = useRoute();
  const navigation = useNavigation();

  const userName = route.params?.userName || 'Unknown User';
  const newNote = route.params?.newNote;

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await axios.get('https://6705d8bb031fd46a83111f3b.mockapi.io/notes');
        if (response.status === 200) {
          setNotes(response.data);
        } else {
          throw new Error(`Error fetching notes: ${response.statusText}`);
        }
      } catch (error) {
        console.error("Fetch notes error:", error.message);
        Alert.alert('Error', 'Failed to fetch notes. Please try again later.');
      }
    };

    fetchNotes();
  }, []);

  useEffect(() => {
    if (newNote && newNote.content) {
      setNotes(prevNotes => [...prevNotes, newNote]);
    }
  }, [newNote]);

  const filteredNotes = notes.filter(note =>
    note.content.toLowerCase().includes(search.toLowerCase())
  );

  const confirmDelete = (id) => {
    setNoteToDelete(id);
    setModalVisible(true);
  };

  const handleDelete = async () => {
    if (noteToDelete) {
      try {
        await axios.delete(`https://6705d8bb031fd46a83111f3b.mockapi.io/notes/${noteToDelete}`);
        setNotes(prevNotes => prevNotes.filter(note => note.id !== noteToDelete));
        setNoteToDelete(null);
      } catch (error) {
        console.error("Delete note error:", error.message);
        Alert.alert('Error', 'Failed to delete the note.');
      }
    }
    setModalVisible(false);
  };

  const confirmEdit = (note) => {
    setNoteToEdit(note);
    setEditedContent(note.content);
    setEditModalVisible(true);
  };

  const handleEdit = async () => {
    if (noteToEdit) {
      try {
        const updatedNote = { id: noteToEdit.id, content: editedContent };

        await axios.put(`https://6705d8bb031fd46a83111f3b.mockapi.io/notes/${noteToEdit.id}`, updatedNote);
        setNotes(prevNotes =>
          prevNotes.map(note =>
            note.id === noteToEdit.id ? updatedNote : note
          )
        );
        Alert.alert('Success', 'Note updated successfully!');
        setNoteToEdit(null);
      } catch (error) {
        console.error("Edit note error:", error.message);
        Alert.alert('Error', 'Failed to update the note.');
      }
    }
    setEditModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={{ width: "100%", height: 500 }}>
        <View style={styles.header}>
          <Image source={require('../assets/ava1.png')} style={styles.profilePic} />
          <Text style={styles.greeting}>Hi {userName}</Text>
          <Text style={styles.subGreeting}>Have a great day ahead!</Text>
        </View>

        <View style={[styles.inputContainer, searchFocused && styles.inputContainerFocused]}>
          <FontAwesome name="search" size={20} style={styles.searchIcon} />
          <TextInput
            placeholder="Search"
            placeholderTextColor="#aaa"
            value={search}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            onChangeText={setSearch}
            style={styles.searchBar}
          />
        </View>

        <FlatList
          data={filteredNotes}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 30 }}
          renderItem={({ item }) => (
            <View style={styles.noteItem}>
              <View style={styles.noteContent}>
                <Image source={require('../assets/checkicon.png')} style={styles.checkmark} />
                <TouchableOpacity style={{ flex: 1 }}>
                  <Text style={styles.noteText}>{item.content}</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={() => confirmEdit(item)}>
                <Text style={styles.editIcon}>✏️</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => confirmDelete(item.id)}>
                <Text style={styles.deleteIcon}>❌</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </ScrollView>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddUpdateNote', { userName })}
      >
        <Text style={styles.plusSign}>+</Text>
      </TouchableOpacity>

      {/* Modal for deletion confirmation */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Bạn có chắc chắn muốn xóa ghi chú này?</Text>
          <View style={styles.buttonContainer}>
            <Pressable
              style={[styles.button, styles.buttonCancel]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.textStyle}>Hủy</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.buttonOK]}
              onPress={handleDelete}
            >
              <Text style={styles.textStyle}>OK</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Modal for editing */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Chỉnh sửa ghi chú:</Text>
          <TextInput
            value={editedContent}
            onChangeText={setEditedContent}
            style={styles.editInput}
          />
          <View style={styles.buttonContainer}>
            <Pressable
              style={[styles.button, styles.buttonCancel]}
              onPress={() => setEditModalVisible(false)}
            >
              <Text style={styles.textStyle}>Hủy</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.buttonOK]}
              onPress={handleEdit}
            >
              <Text style={styles.textStyle}>OK</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 40,
  },
  inputContainerFocused: {
    borderColor: '#1f1f1f',
    borderWidth: 1,
  },
  searchIcon: {
    padding: 10,
    color: '#171A1F',
  },
  searchBar: {
    height: 50,
    flex: 1,
    paddingHorizontal: 10,
    outlineWidth: 0,
  },
  noteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(222, 225, 230, 1.0)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 24,
    marginBottom: 20,
    shadowColor: 'rgba(23, 26, 31, 0.9)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  noteContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  noteText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
  checkmark: {
    width: 20,
    height: 20,
  },
  editIcon: {
    marginLeft: 20,
    fontSize: 20,
    color: '#007BFF',
  },
  deleteIcon: {
    marginLeft: 10,
    fontSize: 20,
    color: '#FF0000',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#007BFF',
    borderRadius: 50,
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  plusSign: {
    fontSize: 40,
    color: '#fff',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    margin: 5,
    flex: 1,
  },
  buttonOK: {
    backgroundColor: '#007BFF',
  },
  buttonCancel: {
    backgroundColor: '#FF0000',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  editInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    width: '100%',
    marginBottom: 20,
  },
});

export default NoteList;
