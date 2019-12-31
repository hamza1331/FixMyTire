/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable*/
import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
  Alert,Image,
  KeyboardAvoidingView,
  ScrollView,
  AsyncStorage
} from 'react-native';
import { connect } from "react-redux";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { setUserInfoAction,LoginAction,setUIDAction } from "../store/actions/actions";
import Spinner from 'react-native-loading-spinner-overlay';
import Form from 'react-native-form';
import CountryPicker from 'react-native-country-picker-modal';
import firebase from 'react-native-firebase'
import { url } from "./Proxy";

const MAX_LENGTH_CODE = 6;
const MAX_LENGTH_NUMBER = 10;

// if you want to customize the country picker
const countryPickerCustomStyles = {};

// your brand's theme primary color
const brandColor = 'darkorange';

const styles = StyleSheet.create({
  countryPicker: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  container: {
    flex: 1
  },
  header: {
    textAlign: 'center',
    marginTop: 60,
    fontSize: 22,
    margin: 20,
    color: '#4A4A4A',
  },
  form: {
    margin: 20
  },
  textInput: {
    padding: 0,
    margin: 0,
    flex: 1,
    fontSize: 20,
    color: brandColor
  },
  button: {
    marginTop: 20,
    height: 50,
    backgroundColor: 'orange',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'Helvetica',
    fontSize: 16,
    fontWeight: 'bold'
  },
  wrongNumberText: {
    margin: 10,
    fontSize: 14,
    textAlign: 'center'
  },
  disclaimerText: {
    marginTop: 30,
    fontSize: 12,
    color: 'grey'
  },
  callingCodeView: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  callingCodeText: {
    fontSize: 20,
    color: brandColor,
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
    paddingRight: 10
  }
});

class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {
      enterCode: false,
      spinner: false,
      isRTL:false,
      country: {
        cca2: 'US',
        callingCode: '92'
      },
      orientation:"portrait",
      phoneNo:""
    };
  }


  _verifyCode = (val) => {
    this.setState({ spinner: true });
    let body= {
      ...this.refs.form.getValues()
    }
    const values = Object.values(body)
    let phone = '+92'+values[0]
    firebase.auth().signInWithPhoneNumber(phone)
  .then(confirmResult =>{
    confirmResult.confirm(val)
  .then(user =>{  
    this.setState({
      spinner:false
    })
    if(user){
      let data = {
        mobile:phone,
        firebaseUID:user._user.uid
      }
      console.log(data)
      fetch(url+'/api/login',{method:"POST",body:JSON.stringify(data),headers: { "Content-Type": "application/json" }}).then(res=>res.json()).then(response=>{
        if(response.message==='Success'){
          let data = response
          delete data.message
          console.log(data.doc)
            AsyncStorage.setItem("userData",JSON.stringify(data.doc))
            this.props.login(data.doc)
            this.props.navigation.navigate("Home")

        }
        else if(response.message=='NoRecord'){
          console.log('No record....')
          this.props.setUserData(user._user)
          this.props.navigation.navigate('SignUP')
        }
      })
      }

  }).catch(err=>{
    if(err){
      Alert.alert("Failed","Invalid Verification Code")
      this.setState({
        spinner:false
      })
    }
  })
  })
  .catch(error =>{
    Alert.alert("Failed","Unknown Eroor")
    this.setState({
      spinner:false
    })
    console.log(error)
  });

  }

  _onChangeText = (val) => {

    if(this.state.enterCode){
      if (val.length === MAX_LENGTH_CODE)
      this._verifyCode(val);
    }
    else{
      if(val.length===MAX_LENGTH_NUMBER){
        this.setState({
          enterCode:true
        })
      }
    }
  }


  _getSubmitAction = () => {
    // this.state.enterCode ? this._verifyCode() : this._getCode();
    this.setState({
      spinner:true
    })
   

    this.setState({
  enterCode:true
    })
  }

  _changeCountry = (country) => {
    this.setState({ country });
    this.refs.form.refs.textInput.focus();
  }

  _renderFooter = () => {

    if (this.state.enterCode)
      return (
        <View>
          <Text style={styles.wrongNumberText} onPress={this._tryAgain}>
            Enter the wrong number or need a new code?
          </Text>
        </View>
      );

    return (
      <View>
        <Text style={styles.disclaimerText}>اوپر "تصدیق کا کوڈ ارسال کریں" پر ٹیپ کرکے ، ہم آپ کو اپنے فون نمبر کی تصدیق کے ل an ایک SMS بھیجیں گے۔ پیغام & amp؛ ڈیٹا کی شرحیں لاگو ہوسکتی ہیں۔</Text>
      </View>
    );

  }

  _renderCountryPicker = () => {

    if (this.state.enterCode)
      return (
        <View />
      );

    return (
      <CountryPicker
        ref={'countryPicker'}
        closeable
        style={styles.countryPicker}
        onChange={this._changeCountry}
        cca2={this.state.country.cca2}
        styles={countryPickerCustomStyles}
        translation='eng'/>
    );

  }

  _renderCallingCode = () => {

    if (this.state.enterCode)
      return (
        <View />
      );

    return (
      <View style={styles.callingCodeView}>
        <Text style={styles.callingCodeText}>+{this.state.country.callingCode}</Text>
      </View>
    );

  }

  render() {

    let headerText =this.state.isRTL?`اپنا ${this.state.enterCode ? 'تصدیقی کوڈ' : 'فون نمبر'}  درج کریں`:`What's your ${this.state.enterCode ? 'verification code' : 'phone number'}?`
let buttonText = this.state.isRTL?this.state.enterCode ? 'تصدیقی کوڈ درج کریں ' : 'تصدیقی کوڈ ارسال کریں۔ ':this.state.enterCode ? 'Verify confirmation code' : 'Send confirmation code'
    let textStyle = this.state.enterCode ? {
      height: 50,
      textAlign: 'center',
      fontSize: 40,
      fontWeight: 'bold',
      fontFamily: 'Courier'
    } : {};

    return (
      <KeyboardAvoidingView behavior={Platform.OS==='ios'?'padding':'none'}  style={{ flex: 1 }}>

      <ScrollView style={styles.container}>
  <View style={{alignItems:'center',marginTop:2,width:wp('100%'),height:(this.state.orientation==="portrait")?hp('45%'):hp('88.5%')}}>
          <Image 
          source={require('./icon.jpeg')}
          style={{width:wp('80%'),height:(this.state.orientation==="portrait")?hp('45%'):hp('89%')}}
          />
          </View>
        <Text style={styles.header}>{headerText}</Text>

        <Form ref={'form'} style={styles.form}>
        <KeyboardAvoidingView>

          <View style={{ flexDirection: 'row',marginLeft:40 }}>

          
          {this._renderCallingCode()}

            <TextInput
              ref={'textInput'}
              name={this.state.enterCode ? 'code' : 'Phone Number' }
              type={'TextInput'}
              underlineColorAndroid={'transparent'}
              autoCapitalize={'none'}
              autoCorrect={false}
              onChangeText={this._onChangeText}
              placeholder={this.state.enterCode ? '_ _ _ _ _ _' : '3XXXXXXXXX'}
              keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'numeric'}
              style={[ styles.textInput, textStyle ]}
              returnKeyType='go'
              autoFocus
              placeholderTextColor={brandColor}
              selectionColor={brandColor}
              maxLength={this.state.enterCode ? 6 : 10}
              onSubmitEditing={this._getSubmitAction} />

          </View>
              </KeyboardAvoidingView>

          <TouchableOpacity style={{marginTop: 20,
    height: 50,
    backgroundColor: 'darkorange',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5}} onPress={()=>{
      if(this.state.enterCode===true){
        this.props.navigation.navigate('SignUP')
      }
      else{
        this.setState({enterCode:true})
      }
    }}>
            <Text style={styles.buttonText}>{ buttonText }</Text>
          </TouchableOpacity>

          {/* {this._renderFooter()} */}

        </Form>

        <Spinner
          visible={this.state.spinner}
          textContent={'One moment...'}
          textStyle={{ color: '#fff' }} />

      </ScrollView>
      </KeyboardAvoidingView>

    );
  }
}
function mapStateToProps(state){
  return({

  })
}
function mapActionsToProps(dispatch){
  return({
     setUserData:(userData)=>{
        dispatch(setUserInfoAction(userData))
     },
     login:(data)=>{
      dispatch(LoginAction(data))
     }
  })
}
// export default Login

export default connect(mapStateToProps,mapActionsToProps)(Login);
