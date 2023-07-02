import {Text, View} from 'react-native';
import React, {Component} from 'react';
import Weather from './src/components/Weather';

export class App extends Component {
  render() {
    return (
      <View>
        <Weather />
      </View>
    );
  }
}

export default App;
