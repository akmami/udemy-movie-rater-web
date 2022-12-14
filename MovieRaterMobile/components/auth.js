import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import React, {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function Auth(props) {

    const [ username, setUsername] = useState('');
    const [ password, setPassword] = useState('');
    const [ regView, setRegView] = useState(false);

    useEffect( () => {
        getData();
    }, []); // call once, not in every render

    const auth = () => {
        if (regView) {
            fetch('http://192.168.1.45:8000/api/users/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username: username, password: password })
            })
            .then( () => {
                setRegView(false);
            })
            .catch( error => console.log(error) )
        } else {
            fetch('http://192.168.1.45:8000/auth/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username: username, password: password })
            })
            .then( response => response.json() )
            .then( response => {
                saveData(response.token);
                props.navigation.navigate("MovieList");
            })
            .catch( error => console.log(error) )
        }
        
    }

    const saveData = async (token) => {
        await AsyncStorage.setItem('MR_Token', token); // wait to finish this
    }

    const getData = async () => {
        const token = await AsyncStorage.getItem('MR_Token'); // wait to finish this
        if (token) props.navigation.navigate("MovieList");
    }

    const toggleView = () => {
        setRegView(!regView);
    }

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Username</Text>
            <TextInput
                style={styles.input}
                placeholder="Username"
                onChangeText={text => setUsername(text)}
                value={username}
                autoCapitalize={'none'}
            />
            <Text style={styles.label}>Password</Text>
            <TextInput
                style={styles.input}
                placeholder="Password"
                onChangeText={text => setPassword(text)}
                value={password}
                autoCapitalize={'none'}
            />
            <Button onPress={ () => auth() } title={regView ? "Register" : "Login"} />
            <TouchableOpacity onPress={ () => toggleView()}>
                {regView ?
                    <Text style={styles.viewText}>Already have an account? Go back to login.</Text> :
                    <Text style={styles.viewText}>Don't have an account? Register here.</Text>
                }
            </TouchableOpacity>
        </View>
    );
}

Auth.navigationOptions = screenProps => ({ 
  title: 'Login',
  headerStyle: {
    backgroundColor: 'orange'
  },
  headerTintColor: '#fff',
  headerTitleStyle: {
    fontWeight: 'bold',
    fontSize: 24
  }
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#282C35',
    padding: 10
  },
  label: {
    fontSize: 20,
    color: 'white',
    padding: 10
  },
  input: {
    fontSize: 16,
    backgroundColor: 'white',
    padding: 10,
    margin: 10
  },
  viewText: {
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    color: 'white',
    fontSize: 20,
    paddingTop: 30,
    paddingLeft: 10,
    paddingRight: 10
  }
});
