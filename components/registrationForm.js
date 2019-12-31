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
import { Text, View, TouchableHighlight,FlatList, Alert,AsyncStorage} from 'react-native'
import { connect } from "react-redux";
import {url} from './Proxy'
import {Button,ButtonGroup} from 'react-native-elements'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { TextField } from 'react-native-materialui-textfield';
import { setUserInfoAction,LoginAction,setUserTypeAction } from "../store/actions/actions";
 
class Register extends Component {
 
  constructor(props) {
    super(props)
    this.state = {
      locale: 'ar',
      selectedIndex: 0,
      isRTL:true,
      fName:"",
      city:"",
      nic:""
    }
    this.updateIndex = this.updateIndex.bind(this)
    this.handleSubmit=this.handleSubmit.bind(this)
    
  }
  componentDidMount(){
    if(this.props.userInfo!==null){
      console.log(this.props.userInfo)
    }
  }
  updateIndex (selectedIndex) {
    this.setState({selectedIndex})
  }
  toggleLocale = () => {
    this.setState({
      locale: (this.state.locale == 'ar' ? 'en' : 'ar')
    })
  }
  handleSubmit(){
    if(this.state.userInfo!==null){
      let data = {
        mobile:this.props.userInfo.phoneNumber,
        firebaseUID:this.props.userInfo.uid,
        fName:this.state.name,
        city:this.state.city,
        type:this.state.selectedIndex===0?"Customer":"Tasker"
      }
      console.log(data)
      fetch(url+'/api/register',{method:"POST",body:JSON.stringify(data),headers: { "Content-Type": "application/json" }}).then(res=>res.json()).then(response=>{
        if(response.message==='Success'){
          let data = response
          delete data.message
          console.log('registered...',data.doc)
          AsyncStorage.setItem("userData",JSON.stringify(data.doc))
          this.props.login(data.doc)
          this.props.navigation.navigate("Home")
          
        }
      }).catch(err=>{
        console.log(err)
      })
      }
  }
  render() {
    const buttons = this.state.isRTL?['صارف', 'کاریگر']:['Customer', 'Tasker']
    const { selectedIndex } = this.state
    return (
      <View style={{ flex: 1,backgroundColor:'white'}}>
         
                  <View style={{backgroundColor:'white',height:hp('5%'),width:wp('100%')}}>
                    
                  </View>
                {this.state.isRTL?<Text style={{fontSize:30,marginRight:10,alignSelf:'flex-end'}}>رجسٹریشن فارم۔
</Text>:
              <Text style={{fontSize:30,marginLeft:10}}>Registration Form</Text>
              }
                   
                   <View style={{alignItems:'center'}}>
                   <View style={{backgroundColor:'#d7d9db',height:hp('70%'),width:wp('90%'),marginTop:15,borderRadius:15}}>
                   {/* <TextField
        label='نام'
        style={{textAlign:'right'}}
      inputContainerStyle={{alignItems:'flex-end',marginRight:20,marginLeft:20,marginTop:10}}
      labelFontSize={30}
      fontSize={25}
      inputContainerPadding={10}
      /> */}
      <ButtonGroup
      onPress={this.updateIndex}
      selectedIndex={selectedIndex}
      buttons={buttons}
      selectedButtonStyle={{backgroundColor:"darkorange"}}
      containerStyle={{height: 50}}
    />
    {this.state.isRTL?
    <View>
           <TextField
        label='نام'
        style={{textAlign:'right'}}
        tintColor='darkorange'
        onChangeText={text=>this.setState({name:text})}
      inputContainerStyle={{alignItems:'flex-end',marginRight:20,marginLeft:20,marginTop:10}}
      labelFontSize={30}
      fontSize={25}
      inputContainerPadding={10}
      /> 
      
        <TextField
        label='شہر'

        tintColor='darkorange'
        style={{textAlign:'right'}}
      inputContainerStyle={{alignItems:'flex-end',marginRight:20,marginLeft:20,marginTop:10}}
      labelFontSize={30}
      onChangeText={text=>this.setState({city:text})}
      fontSize={25}
      inputContainerPadding={10}
      /> 
         <TextField
        label='شناختی کارڈ نمبر '
        tintColor='darkorange'
        onChangeText={text=>this.setState({nic:text})}
        style={{textAlign:'right'}}
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
        onChangeText={text=>this.setState({name:text})}
        
      inputContainerStyle={{marginRight:20,marginLeft:20,marginTop:10}}
      labelFontSize={20}
      tintColor='darkorange'
      fontSize={20}
      inputContainerPadding={10}
      />
      <TextField
        label='City'
      onChangeText={text=>this.setState({city:text})}        
      inputContainerStyle={{marginRight:20,marginLeft:20}}
      labelFontSize={20}
        tintColor='darkorange'
        fontSize={20}
      inputContainerPadding={10}
      />
      
      <TextField
        label='CNIC'
        tintColor='darkorange'
        onChangeText={text=>this.setState({nic:text})}      
      inputContainerStyle={{marginRight:20,marginLeft:20}}
      labelFontSize={20}
      fontSize={20}
      inputContainerPadding={10}
      />
      </View>
  }
      {this.state.isRTL?<Button  title='رجسٹر کریں۔' onPress={this.handleSubmit} buttonStyle={{alignSelf:'flex-start',marginLeft:25,marginTop:50,backgroundColor:"darkorange"}} />
      :
      <Button title='Register' buttonStyle={{alignSelf:'flex-end',marginRight:25,marginTop:50}} />
}
                  </View>
                  </View>
       </View>
    )
  }
}
function mapStateToProps(state){
  return({
    userInfo:state.rootReducer.userInfo
  })
}
function mapActionsToProps(dispatch){
  return({
     setUserData:(userData)=>{
        dispatch(setUserInfoAction(userData))
     },
     login:(data)=>{
      dispatch(LoginAction(data))
     },
     setType:(data)=>{
      dispatch(setUserTypeAction(data))
     }
  })
}
export default connect(mapStateToProps,mapActionsToProps)(Register);
