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
import { Text, View, Alert,Platform,ToastAndroid} from 'react-native'

import {Header,Icon,Button,Avatar,Rating} from 'react-native-elements'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { connect } from "react-redux";
import { url } from "./Proxy";
import Firebase from 'react-native-firebase'
import ImagePicker from 'react-native-image-picker';
class MyProfile extends Component {
 
  constructor(props) {
    super(props)
    this.state = {
      locale: 'ar',
      isRTL:false,
      fName:"",
      mobile:"",
      city:"",
      nic:"",
      profilePic:""
    }
    this.selectPhotoTapped=this.selectPhotoTapped.bind(this)
    this.handleImageUpload=this.handleImageUpload.bind(this)
  }
 
  toggleLocale = () => {
    this.setState({
      locale: (this.state.locale == 'ar' ? 'en' : 'ar')
    })
  }
  selectPhotoTapped() {
    const options = {
      quality: 0.5,
      maxWidth: 800,
      maxHeight: 500
    };

    ImagePicker.showImagePicker(options, (response) => {

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
        this.handleImageUpload()
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
    let {image} = this.state
    let storage = Firebase.storage()
    let storageRef = storage.ref(`sockhay/${this.props.UID}/image`+Date.now())
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
        let data = {
          firebaseUID:this.props.UID,
          profilePic:downloadURL
        }
        fetch(url+'/api/addImage',{method:"PUT",body:JSON.stringify(data),headers: { "Content-Type": "application/json" }})
        .then(res=>res.json()).then((response)=>{
          if(Platform.OS==='android'){
            ToastAndroid.showWithGravityAndOffset(
              'Upload Complete!!',
              ToastAndroid.LONG,
              ToastAndroid.BOTTOM,
              25,
              50,
            );
          }
          this.setState({
            profilePic:response.data.profilePic
          })
        }).catch(err=>Alert.alert('Failed',err))
      });
    })
  }
 componentDidMount(){
   if(this.props.UID){
     this.setState({
       profilePic:this.props.userInfo.profilePic
     })
  }
 }
  render() {
    return (
      <View style={{ flex: 1,backgroundColor:'white'}}>
         <Header  placement="left"
                  rightComponent={
                <Icon  containerStyle={{marginBottom:10,marginLeft:10}}
                name="ios-menu"
                type="ionicon"
                color="white"
                size={40}
                />
                  }
                  centerComponent={this.state.isRTL?
                  <Text style={{fontSize:30,color:'white',alignSelf:'center',marginBottom:10}}>Order Details</Text>
                  :
                  <Text style={{fontSize:30,color:'white',alignSelf:'center',marginBottom:10}}>میری پروفائل
                  </Text>
                  }
                  containerStyle={{backgroundColor:'gray',
                  height: Platform.OS === 'ios' ? 70 :  70 - 10}}
                  />
                  <View style={{backgroundColor:'white',height:hp('12%'),width:wp('100%')}}>
                    
                  </View>
                  <View style={{alignItems:'center'}}>
                  <Avatar
                  size='xlarge'
                  onPress={this.selectPhotoTapped}
  rounded
  source={{
    uri:this.state.profilePic,
  }}
/>
<View style={{flexDirection:'row',marginTop:20}}>
<Rating
  type='star'
  readonly={true}
  ratingCount={5}
  imageSize={30}

  onFinishRating={this.ratingCompleted}
/>
<Text style={{fontSize:20,marginLeft:8}}>(3.5)</Text>
</View>
<View style={{flexDirection:'row',marginTop:20,justifyContent:'space-between',width:wp('65%')}}>
<Text style={{fontSize:20,marginLeft:8}}>Name</Text>
<Text style={{fontSize:20,marginLeft:8}}>{this.props.userInfo.fName}</Text>
</View>
<View style={{flexDirection:'row',marginTop:20,justifyContent:'space-between',width:wp('65%')}}>
<Text style={{fontSize:20,marginLeft:8}}>City</Text>
<Text style={{fontSize:20,marginLeft:8}}>{this.props.userInfo.city}</Text>
</View>
<View style={{flexDirection:'row',marginTop:20,justifyContent:'space-between',width:wp('65%')}}>
<Text style={{fontSize:20,marginLeft:8}}>CNIC</Text>
<Text style={{fontSize:20,marginLeft:8}}>{this.props.userInfo.nic}</Text>
</View>
<View style={{flexDirection:'row',marginTop:20,justifyContent:'space-between',width:wp('65%')}}>
<Text style={{fontSize:20,marginLeft:8}}>Phone no.</Text>
<Text style={{fontSize:20,marginLeft:8}}>{this.props.userInfo.mobile}</Text>
</View>
{this.state.isRTL
?  <Button onPress={()=>this.props.navigation.navigate('EditProfile')} title='Edit Profile' buttonStyle={{marginTop:20}} />
:  <Button title='پروفائل میں ترمیم کریں' onPress={()=>this.props.navigation.navigate('EditProfile')} buttonStyle={{marginTop:20,fontSize:30,backgroundColor:"darkorange"}} />
}
                  </View>
              

                
              

       </View>
    )
  }
}
 function mapStateToProps(state){
  return({
    isCustomer:state.rootReducer.isCustomer,
    userInfo:state.rootReducer.userInfo,
    userID:state.rootReducer.userID,
    UID:state.rootReducer.UID
  })
}
function mapActionsToProps(dispatch){
  return({
     
  })
}
export default connect(mapStateToProps,mapActionsToProps)(MyProfile)
