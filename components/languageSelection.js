/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable*/
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react'
import { Text, View, TouchableHighlight,Dimensions,Image,TouchableOpacity} from 'react-native'
import ImagePicker from 'react-native-image-picker';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
 
class Language extends Component {
 
  constructor(props) {
    super(props);
    this.state = {
      filePath: {},
      isRTL:true,
      orientation:"portrait"
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
        <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
           <View style={{alignItems:'center',marginTop:2,width:wp('100%'),height:(this.state.orientation==="portrait")?hp('45%'):hp('88.5%')}}>
          <Image 
          source={require('./icon.jpeg')}
          style={{width:wp('80%'),height:(this.state.orientation==="portrait")?hp('45%'):hp('89%')}}
          />
          </View>
          <Text style={{fontSize:30,color:'black',textAlign:"center",marginTop:10}}>Select Your Language</Text>
        <TouchableOpacity style={{alignItems:'center',marginTop:10,borderRadius:15,justifyContent:'center',height:hp('10%'),width:wp('80%'),backgroundColor:'darkorange'}} onPress={()=>this.props.navigation.navigate('Login')}>
            <Text style={{fontSize:30,color:'white'}}>English</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{alignItems:'center',marginTop:10,borderRadius:15,justifyContent:'center',height:hp('10%'),width:wp('80%'),backgroundColor:'darkorange'}}>
        <Text style={{fontSize:30,color:'white'}}>اردو</Text>
        </TouchableOpacity>
        </View>
      
    )
  }
}
 
export default Language;
