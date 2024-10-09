import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import RegisterLogin from './screens/RegisterLogin';
import NoteList from './screens/NoteList';
import AddUpdateNote from './screens/AddUpdateNote';
import Home from './screens/Home';
import SignUp from './screens/SignUp';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">

        <Stack.Screen 
            name="Home" 
            component={Home} 
            options={{ headerShown: false }} 
        />

        <Stack.Screen 
            name="RegisterLogin" 
            component={RegisterLogin} 
            options={{ 
            headerTitle: '',
            headerBackTitleVisible: false, 
            headerStyle: {
              elevation: 0, 
              shadowOpacity: 0, 
              borderBottomWidth: 0, 
            },
            }}           
        />

        <Stack.Screen 
            name="SignUp" 
            component={SignUp} 
            options={{ 
            headerTitle: '',
            headerBackTitleVisible: false, 
            headerStyle: {
              elevation: 0, 
              shadowOpacity: 0, 
              borderBottomWidth: 0, 
            },
            }}
        />

        <Stack.Screen 
            name="NoteList" 
            component={NoteList} 
            options={{ 
            headerTitle: '',
            headerBackTitleVisible: false, 
            headerStyle: {
              elevation: 0, 
              shadowOpacity: 0, 
              borderBottomWidth: 0, 
            },
            }}
        />

        <Stack.Screen 
            name="AddUpdateNote" 
            component={AddUpdateNote} 
            options={{ 
            headerTitle: '',
            headerBackTitleVisible: false, 
            headerStyle: {
              elevation: 0, 
              shadowOpacity: 0, 
              borderBottomWidth: 0, 
            },
            }}
         />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
