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
import { Text, View, TouchableHighlight,FlatList,Image} from 'react-native'
import ImagePicker from 'react-native-image-picker';
// Import { RTLView, RTLText } from react-native-rtl-layout
import {Header,Icon,Button,Avatar,Rating,ButtonGroup,CheckBox} from 'react-native-elements'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { TextField } from 'react-native-materialui-textfield';
import { connect } from "react-redux";

import { url } from "./Proxy";

 
class EditProfile extends Component {
 
  constructor(props) {
    super(props);
    this.state = {
      filePath: {},
      isRTL:true,
      fName:"",
      nic:"",
      city:"",
      uploading:false,
      image:""
    };
    this.selectPhotoTapped=this.selectPhotoTapped.bind(this)
    this.handleImageUpload=this.handleImageUpload.bind(this)
  }

  selectPhotoTapped() {
    const options = {
      quality: 0.5,
      maxWidth: 800,
      maxHeight: 500
    };

    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled photo picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        let source = { uri: response.uri };
        console.log(source.uri)
        this.setState({
          image:source.uri
        })
        // this.handleImageUpload()
      }
    });
  }
  handleImageUpload(){
    if(Platform.OS==='android'){
      ToastAndroid.showWithGravityAndOffset(
        'Uploading Image...',
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50,
      );
    }
    this.setState({
      uploading:true
    })
    let {image} = this.state
    let storage = Firebase.storage()
    let storageRef = storage.ref(`sokhay/${this.props.UID}/image`+Date.now())
    let task = storageRef.putFile(image)
    task.on('state_changed', (snapshot)=> {
      let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      //   console.log('Upload is ' + progress.toFixed(2) + '% done');
      switch (snapshot.state) {
        case Firebase.storage.TaskState.PAUSED: // or 'paused'
          //   console.log('Upload is paused');
          break;
        case Firebase.storage.TaskState.RUNNING: // or 'running'
            console.log(progress);
          break;
          default:
          return
      }
    }, (error)=> {
      alert(error.message)
    }, () => {
      storageRef.getDownloadURL().then((downloadURL) => {
      this.setState({
        profilePic:downloadURL,
        uploading:false
      })
      if(Platform.OS==='android'){
        ToastAndroid.showWithGravityAndOffset(
          'Upload complete...',
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50,
        );
      }
      });
    })
  }
  render() {
    return (
      <View style={{ flex: 1,backgroundColor:'white'}}>
         <Header  placement="left"
                  rightComponent={
                <Icon  containerStyle={{marginBottom:10,marginLeft:10}}
                name="ios-arrow-forward"
                type="ionicon"
                color="white"
                onPress={()=>this.props.navigation.goBack()}
                size={40}
                />
                  }
                  centerComponent={
                  this.state.isRTL?
                  <Text style={{fontSize:30,color:'white',alignSelf:'center',marginBottom:10}}>پروفائل میں ترمیم کریں </Text>
                :
                <Text style={{fontSize:30,color:'white',alignSelf:'center',marginBottom:10}}>Edit Profile </Text>

                }
                 
                  containerStyle={{backgroundColor:'gray',
                  height: Platform.OS === 'ios' ? 70 :  70 - 10}}
                  />
                  <Text style={{fontSize:30,marginLeft:10}}></Text>
                   <View style={{alignItems:'center'}}>
                   <View style={{backgroundColor:'#d7d9db',height:hp('75%'),width:wp('90%'),marginTop:15,borderRadius:15}}>
                   {/* <TextField
        label='نام'
        style={{textAlign:'right'}}
      inputContainerStyle={{alignItems:'flex-end',marginRight:20,marginLeft:20,marginTop:10}}
      labelFontSize={30}
      fontSize={25}
      inputContainerPadding={10}
      /> */}
    
    {this.state.isRTL?
    <View>
           <TextField
        label='نام'
        value={this.props.userInfo.fName}
        style={{textAlign:'right'}}
      inputContainerStyle={{alignItems:'flex-end',marginRight:20,marginLeft:20,marginTop:10}}
      labelFontSize={30}
      
      tintColor='darkorange'
      fontSize={25}
      inputContainerPadding={10}
      /> 
      
        <TextField
        label='شہر'
        style={{textAlign:'right'}}
      tintColor='darkorange'
      value={this.props.userInfo.city}

      inputContainerStyle={{alignItems:'flex-end',marginRight:20,marginLeft:20,marginTop:10}}
      labelFontSize={30}
      fontSize={25}
      inputContainerPadding={10}
      /> 
         <TextField
        label='شناختی کارڈ نمبر '
        value={this.props.userInfo.nic}

        style={{textAlign:'right'}}
      tintColor='darkorange'

      inputContainerStyle={{alignItems:'flex-end',marginRight:20,marginLeft:20,marginTop:10}}
      labelFontSize={30}
      fontSize={25}
      inputContainerPadding={10}
      /> 
      </View>
      :
      <View>
      <TextField
        label='Name'
        
      inputContainerStyle={{marginRight:20,marginLeft:20,marginTop:10}}
      labelFontSize={20}
      fontSize={20}
      tintColor='darkorange'

      inputContainerPadding={10}
      />
      <TextField
        label='City'
        
      inputContainerStyle={{marginRight:20,marginLeft:20}}
      labelFontSize={20}
      tintColor='darkorange'

      fontSize={20}
      inputContainerPadding={10}
      />
      
      <TextField
        label='CNIC'
      
      inputContainerStyle={{marginRight:20,marginLeft:20}}
      labelFontSize={20}
      tintColor='darkorange'

      fontSize={20}
      inputContainerPadding={10}
      />
      </View>
  }
    <View style={{flexDirection:'row',justifyContent:'center'}}>
    {this.state.isRTL?
    <View>
      <Button disabled={this.state.uploading} disabledStyle={{backgroundColor:"gray"}} title="تصویر منتخب کریں۔" onPress={this.selectPhotoTapped} buttonStyle={{width:wp('50%'),backgroundColor:"darkorange"}} />
      {this.state.image.length>0&&  <Image
source={{ uri: this.state.image }}
style={{ width: 75, height: 75,marginLeft:50 }}
/>}
    </View>
    :
    <View>
    <Button title="Choose File" onPress={this.selectPhotoTapped} buttonStyle={{width:wp('30%'),backgroundColor:"darkorange"}} />
    <Image
source={{ uri: this.state.image }}
style={{ width: 75, height: 75,marginTop:10,marginLeft:20 }}
/>
    </View>
    }
  
    </View>
                {this.state.isRTL?<Button title='محفوظ کریں' buttonStyle={{alignSelf:'flex-start',marginLeft:25,marginTop:25,backgroundColor:"#b5803a"}} />
:
<Button title='Save' buttonStyle={{alignSelf:'flex-end',marginRight:25,marginTop:25}} />

}
                  </View>
                  </View>
           
       </View>
      
    )
  }
}
function mapStateToProps(state){
  return({
    isCustomer:state.rootReducer.isCustomer,
    userInfo:state.rootReducer.userInfo,
    UID:state.rootReducer.UID
  })
}
function mapActionsToProps(dispatch){
  return({
     
  })
}
export default connect(mapStateToProps,mapActionsToProps)(EditProfile)
