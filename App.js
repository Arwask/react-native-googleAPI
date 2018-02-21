import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import FetchLocation from './components/FetchLocation';
import UsersMap from './components/UsersMaps';

export default class App extends React.Component {
  state = {
    userLocation: null,
    userPlaces: []
  };
  getUserLocationHandler = () => {
    navigator.geolocation.getCurrentPosition(
      position => {
        this.setState({
          userLocation: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: 0.0622,
            longitudeDelta: 0.0421
          }
        });
        fetch('https://doctor-patients-6bb2e.firebaseio.com/places.json', {
          method: 'POST',
          body: JSON.stringify({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          })
        })
          .then(res => console.log(res))
          .catch(err => console.log(err)); //much like xmlHttp call to post the location of the place to the firebase app
      },
      err => console.log(err)
    );
  };

  getUserPlacesHandler = () => {
    fetch('https://doctor-patients-6bb2e.firebaseio.com/places.json')
      .then(res => res.json()) //make it into a json
      .then(parsedRes => {
        let placesArray = [];
        for (const key in parsedRes) {
          placesArray.push({
            latitude: parsedRes[key].latitude,
            longitude: parsedRes[key].longitude,
            id: key
          });
        }
        this.setState({
          userPlaces: placesArray
        });
      }) // once done we get a json out of the raw data
      .catch(err => console.log(err)); //much like xmlHttp call to post the location of the place to the firebase app
  };
  render() {
    return (
      <View style={styles.container}>
        <Text>Lets see where are you located!</Text>
        <View style={{ marginBottom: 20 }}>
          <Button title="Get Places" onPress={this.getUserPlacesHandler} />
        </View>
        {/* wrapping in view to make it easy to style it */}
        <FetchLocation onGetLocation={this.getUserLocationHandler} />
        <UsersMap userLocation={this.state.userLocation} userPlaces={this.state.userPlaces} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
