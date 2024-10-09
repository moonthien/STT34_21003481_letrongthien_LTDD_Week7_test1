import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert, Image } from 'react-native';
import axios from 'axios';

const SignUp = ({ navigation }) => {
  const [name, setName] = useState(''); 
  const [username, setUsername] = useState(''); 
  const [password, setPassword] = useState('');

  const validateInputs = () => {
    if (!name) {
      Alert.alert('Lỗi: Tên đầy đủ không được để trống');
      return false;
    }
    if (!username) {
      Alert.alert('Lỗi: Tên người dùng không được để trống');
      return false;
    }
    if (username.length < 3) {
      Alert.alert('Lỗi: Tên người dùng phải có ít nhất 3 ký tự');
      return false;
    }
    if (!password) {
      Alert.alert('Lỗi: Mật khẩu không được để trống');
      return false;
    }
    if (password.length < 3) {
      Alert.alert('Lỗi: Mật khẩu phải có ít nhất 3 ký tự');
      return false;
    }
    return true;
  };

  const handleSignUp = async () => {
    if (!validateInputs()) {
      return; 
    }

    try {
      // Lấy danh sách người dùng từ db.json để kiểm tra trùng lặp username
      const response = await axios.get('https://6705d8bb031fd46a83111f3b.mockapi.io/users');
      const userExists = response.data.some(u => u.username.toLowerCase() === username.toLowerCase());

      if (userExists) {
        Alert.alert('Lỗi: Tên người dùng đã tồn tại');
        return;
      }

      // Nếu username chưa tồn tại, tạo tài khoản mới
      const newUserId = response.data.length ? (parseInt(response.data[response.data.length - 1].id) + 1).toString() : "1"; // Tạo id mới
      const newUser = { id: newUserId, name, username, password };
      await axios.post('https://6705d8bb031fd46a83111f3b.mockapi.io/users', newUser);

      Alert.alert('Đăng ký thành công');
      navigation.navigate('RegisterLogin'); // Quay lại giao diện đăng nhập sau khi đăng ký
    } catch (error) {
      console.error(error);
      Alert.alert('Lỗi: Không thể kết nối đến máy chủ');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../assets/image95.png')}
          style={styles.image}
        />
      </View>
      <Text style={styles.title}>Đăng Ký</Text>
      <TextInput
        placeholder="Tên đầy đủ"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Tên người dùng"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />
      <TextInput
        placeholder="Mật khẩu"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Đăng Ký</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',  
    alignItems: 'center',
    backgroundColor: '#fff', 
    paddingHorizontal: 20,
    paddingTop: 50, 
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 220,
    height: 220,
    resizeMode: 'contain',
  },
  button: {
    backgroundColor: '#007AFF', 
    paddingVertical: 15,
    width: '100%',
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 28,
    marginBottom: 30,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#333', 
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc', 
    borderRadius: 10, 
    marginBottom: 15,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#fff', 
    width: '100%',
  },
});

export default SignUp;
