import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, Alert } from 'react-native'; // Added Alert import
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import axios from 'axios'; 
import FontAwesome from 'react-native-vector-icons/FontAwesome'; 

const Home = () => {
  const [username, setUsername] = useState('');
  const [userNameFocused, setUserNameFocused] = useState(false);
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      // Reset the username when the screen is focused
      setUsername('');
    }, [])
  );

  const handleGetStarted = async () => {
    try {
      const response = await axios.get('https://6705d8bb031fd46a83111f3b.mockapi.io/users');
      const user = response.data.find(u => u.username.toLowerCase() === username.toLowerCase());

      if (user) {
        navigation.navigate('NoteList', { userName: user.name });
      } else {
        Alert.alert('Username không tồn tại trong hệ thống. Vui lòng nhập lạis!');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Đã xảy ra lỗi khi kiểm tra username.');
    }
  };

  const handleLogin = () => {
    navigation.navigate('RegisterLogin');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../assets/image95.png')}
          style={styles.image}
        />
      </View>
      <Text style={styles.title}>MANAGE YOUR TASK</Text>
      <View style={[styles.inputContainer, username.length > 0, userNameFocused && styles.inputContainerFocused]}>
        <FontAwesome name="user" size={20} style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Enter your username"
          placeholderTextColor="#aaa"
          value={username}
          onFocus={() => setUserNameFocused(true)}
          onBlur={() => setUserNameFocused(false)}
          onChangeText={setUsername}
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
        <Text style={styles.buttonText}>GET STARTED</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  header: {
    marginBottom: 30,
  },
  image: {
    width: 220,
    height: 220,
    resizeMode: 'contain',
    top: '-25%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6C63FF',
    marginBottom: 20,
    top: '-6%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 50, 
  },
  inputContainerFocused: {
    borderColor: '#6C63FF', 
    borderWidth: 1,
  },
  icon: {
    padding: 10, 
    color: '#6C63FF',
  },
  input: {
    height: 50,
    flex: 1, 
    paddingHorizontal: 10,
    outlineWidth: 0,
  },
  button: {
    backgroundColor: '#00BDD6',
    paddingVertical: 15,
    width: 190, 
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center', 
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginButton: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    width: 190, 
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center', 
  },
  loginText: {
    color: '#808080',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Home;
