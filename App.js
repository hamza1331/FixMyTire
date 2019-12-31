/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react'
import { Text, View, TouchableHighlight,FlatList,Image,TouchableOpacity} from 'react-native'
import ImagePicker from 'react-native-image-picker';
import {Header,Icon,Button,Avatar,Rating,ButtonGroup,CheckBox} from 'react-native-elements'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { TextField } from 'react-native-materialui-textfield';
import CameraRollPicker from 'react-native-camera-roll-picker';
import { Dropdown } from 'react-native-material-dropdown';
import DrawerNavigator from './navigation/Drawer'
 
class App extends Component {
 
  constructor(props) {
    super(props);
    this.state = {
      filePath: {},
      isRTL:true
    };
  }
  chooseFile = () => {
    var options = {
      title: 'Select Image',
      customButtons: [
        { name: 'customOptionKey', title: 'Choose Photo from Custom Option' },
      ],
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.showImagePicker(options, response => {
      console.log('Response = ', response);
 
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        let source = response;
        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };
        this.setState({
          filePath: source,
          
        });
      }
    });
  };
  render() {
   
 
    const buttons = ['Customer', 'Service Provider']
    const { selectedIndex } = this.state
    return (
   <DrawerNavigator />
    
      
    )
  }
}
 
export default App;
