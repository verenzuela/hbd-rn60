import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { BackHandler } from 'react-native';
import Styles from '../../commons/styles';

export default class About extends Component {
  constructor(props) {
    super(props);
    this.handleBackButton = this.handleBackButton.bind(this);
    this.state = {
    };
  }

  componentDidMount(){
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  };

  componentWillUnmount(){
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  handleBackButton = () => {
    this.props.navigation.navigate('Home');
    return true;
  }
  
  render() {
    
    const {
      container, 
      centerAll,
      iconColor,
      borderColor,
    } = Styles;

    return (
      <View style={[container, centerAll]}>
        <Text> About </Text>
      </View>
    );
  }
}
