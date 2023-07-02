import {
  Alert,
  PermissionsAndroid,
  Text,
  View,
  ImageBackground,
  SafeAreaView,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import React, {Component} from 'react';

import Geolocation from '@react-native-community/geolocation';

const {width, height} = Dimensions.get('window'); 
export class Weather extends Component {
  state = {
    latitude: 0,
    longitude: 0,
    error: '',
    city: '',
    cityName: '',
    region: '',
    currentTemp: '',
    lowestTemp: '',
    highestTemp: '',
    weather: '',
    searchCity: '',
  };
  componentDidMount() {
    this.getCurrentPosition();
  }

  getCurrentPosition = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Example App',
          message: 'Example App access to your location ',
          buttonPositive: 'ok',
          buttonNeutral: 'Ask me later',
          buttonNegative: 'Cancel',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        Geolocation.getCurrentPosition(
          position =>
            this.setState(
              {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              },
              () => this.getCurrentCity(),
            ),
          error => this.setState({error: error.message}),
          {enableHighAccuracy: false, timeout: 50000},
        );
        Alert.alert('You can use the location');
      } else {
        console.log('location permission denied');
        Alert.alert('Location permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  getCurrentCity = async () => {
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${this.state.latitude} + ${this.state.longitude}&key=bedd7777403f42ee9748c66c7132c500`;
    fetch(url)
      .then(response => response.json())
      .then(response => {
        this.setState({city: response.results[0].components.city}, () =>
          this.getCurrentWeather(this.state.city),
        );
      });
  };

  getCurrentWeather = (city: string) => {
    const url = `http://api.weatherapi.com/v1/current.json?key=9bb5814b368c4cb6ad183908232006&q=${city}`;
    fetch(url)
      .then(response => response?.json())
      .then(response => {
        console.log(response.location);
        this.setState({
          cityName: response?.location.name,
          region: response?.location.region,
          currentTemp: response?.current.temp_c,
          lowestTemp: response?.current.temp_c - 3,
          highestTemp: response?.current.temp_c + 3,
          weather: response?.current.condition.text,
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    let temp = parseInt(this.state.currentTemp);
    let background;
    if (temp < 0) {
      background = require('./images/minustemp.png');
    } else if (temp >= 0 && temp <= 20) {
      background = require('./images/below20.png');
    } else if (temp > 20 && temp <= 27) {
      background = require('./images/below20to27.png');
    } else if (temp > 27 && temp <= 29) {
      background = require('./images/below29to28.png');
    } else {
      background = require('./images/above30.png');
    }

    console.log(
      this.state.cityName,
      this.state.currentTemp,
      this.state.region,
      this.state.searchCity,
    );
    return (
      <SafeAreaView style={{height: height}}>
        <ImageBackground
          style={{height: '100%', width: '100%'}}
          source={background}>
          {this.state.currentTemp ? (
            <View style={{paddingLeft: 12, paddingRight: 12}}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  paddingTop: 60,
                }}>
                <Text
                  style={{
                    fontSize: 45,
                    fontWeight: '600',
                    color: '#ffffff',
                    textAlign: 'center',
                    paddingRight: 9,
                  }}>
                  {this.state.currentTemp}°C
                </Text>
                <View>
                  <Text
                    style={{fontSize: 12, fontWeight: '400', color: 'white'}}>
                    H : {this.state.highestTemp} ํ
                  </Text>
                  <Text
                    style={{fontSize: 12, fontWeight: '400', color: 'white'}}>
                    L : {this.state.lowestTemp} ํ
                  </Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                }}>
                <Image
                  style={{width: 24, height: 24, tintColor: '#ffffff'}}
                  source={require('./images/pin.png')}
                />
                <Text style={{fontSize: 12, fontWeight: '400', color: 'white'}}>
                  {' '}
                  {this.state.cityName},{' '}
                </Text>
                <Text style={{fontSize: 12, fontWeight: '400', color: 'white'}}>
                  {this.state.region}
                </Text>
              </View>
              <View
                style={{
                  top: 250,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <TextInput
                  value={this.state.searchCity}
                  onChangeText={(value: string) =>
                    this.setState({searchCity: value.trim()})
                  }
                  style={{
                    height: 40,
                    width: 180,
                    backgroundColor: 'grey',
                    padding: 10,
                    borderRadius: 5,
                  }}
                  placeholder="Search"
                  placeholderTextColor="#ffffff"
                />
                {this.state.searchCity !== '' ? (
                  <TouchableOpacity
                    onPress={() => {
                      this.getCurrentWeather(this.state.searchCity);
                      this.setState({searchCity: ''});
                    }}>
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: '400',
                        color: 'white',
                        height: 40,
                        width: 120,
                        backgroundColor: 'blue',
                        justifyContent: 'center',
                        alignItems: 'center',
                        textAlign: 'center',
                        paddingTop: 7,
                        marginTop: 30,
                        borderRadius: 9,
                      }}>
                      Submit
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity>
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: '400',
                        color: 'white',
                        height: 40,
                        width: 120,
                        backgroundColor: 'blue',
                        justifyContent: 'center',
                        alignItems: 'center',
                        textAlign: 'center',
                        paddingTop: 7,
                        marginTop: 30,
                        borderRadius: 9,
                      }}>
                      Submit
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ) : (
            <ActivityIndicator size="large" />
          )}
        </ImageBackground>
      </SafeAreaView>
    );
  }
}

export default Weather;
