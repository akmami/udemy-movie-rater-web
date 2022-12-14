import { FlatList, StyleSheet, Text, View, Image, Button } from 'react-native';
import React, {useState, useEffect} from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function MovieList(props) {

  const [movies, setMovies] = useState([]);
  let token = null;

  const getData = async () => {
    token = await AsyncStorage.getItem('MR_Token');
    if (token) {
      getMovies();
    } else {
      props.navigation.navigate("Auth");
    }
  }

  useEffect( () => {
    getData();
  }, [])

  const getMovies = () => {
    fetch('http://192.168.1.45:8000/api/movies/', {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      }
    })
    .then( response => response.json() )
    .then( response => setMovies(response) )
    .catch( error => console.log(error) )
  }

  const movieClicked = async (movie) => {
    token = await AsyncStorage.getItem('MR_Token');
    props.navigation.navigate("Detail", {movie: movie, title: movie.title, token: token} );
  }

  return (
    <View style={styles.container}>
      <Image source={require('../assets/MR_logo.png')} 
        style={{width: '100%', height: 135, paddingTop:30}}
        resizeMode="contain"/>
      <FlatList 
        data={movies}
        renderItem={ ({item}) => (
          <TouchableOpacity onPress={ () => movieClicked(item) }>
            <View style={styles.item}>
              <Text style={styles.itemText}>{item.title}</Text>
            </View>       
          </TouchableOpacity>
        )}
        keyExtractor={ (item, index) => index.toString() }
      />
    </View>
  );
}

MovieList.navigationOptions = screenProps => ({ 
  title: "List of Movies",
  headerStyle: {
    backgroundColor: 'orange'
  },
  headerTintColor: '#fff',
  headerTitleStyle: {
    fontWeight: 'bold',
    fontSize: 24
  },
  headerRight: () => 
    <Button title="Add New" color="white" 
      onPress={ () => screenProps.navigation.navigate("Edit", {movie: {title: '', description: ''}}) }
    />
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: '50em',
  },
  item: {
    flex: 1,
    padding: 10,
    height: 50,
    backgroundColor: '#282C35',
    width: '100%'
  },
  itemText: {
    flex: 1,
    fontSize: 24,
    width: '100%'
  }
});
