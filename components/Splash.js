/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable*/
import React, { Component } from 'react'
import { Text, View,Image,ActivityIndicator,Platform,AsyncStorage,StyleSheet } from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { url } from "./Proxy";
import AppIntroSlider from 'react-native-app-intro-slider';
import { setUserInfoAction,LoginAction } from "../store/actions/actions";
import { connect } from "react-redux";
const styles = StyleSheet.create({
    mainContent: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding:10,
      backgroundColor:'blue'
    },
    image: {
      width: '100%',
      height: '95%',
    },
    text: {
      color: 'rgba(0, 0, 0, 0.8)',
      backgroundColor: 'transparent',
      textAlign: 'center',
      paddingHorizontal: 16,
    },
    title: {
      fontSize: 22,
      color: 'white',
      backgroundColor: 'transparent',
      textAlign: 'center',
      marginBottom: 16,
    },
  });
const slides = [
    {
      key: 'somethun',
      title: 'Title 1',
      text: 'Description.\nSay something cool',
      image: require('./icon.jpeg'),
      backgroundColor: '#59b2ab',
    },
    {
      key: 'somethun-dos',
      title: 'Title 2',
      text: 'Other cool stuff',
      image: require('./img0.jpg'),
      backgroundColor: '#febe29',
    },
    {
      key: 'somethun1',
      title: 'Rocket guy',
      text: 'I\'m already out of descriptions\n\nLorem ipsum bla bla bla',
      image: require('./img1.jpg'),
      backgroundColor: '#22bcb5',
    },
    {
      key: 'somethuncsd1',
      title: 'Rocket guy',
      text: 'I\'m already out of descriptions\n\nLorem ipsum bla bla bla',
      image: require('./img2.jpg'),
      backgroundColor: '#22bcb5',
    }
  ];
class Splash extends Component {
    constructor(props) {
        super(props);
        this.state = {
          orientation:"portrait",
          showSlider:true
        };
      }
    componentDidMount(){
       AsyncStorage.getItem('userData').then(data=>{
        if(data!==null){
            let user = JSON.parse(data)
            let firebaseUID = user.userdata.firebaseUID
            if(firebaseUID){
                fetch(url+'/api/getUserData'+firebaseUID)
                .then(res=>res.json())
                .then(response=>{
                    if(response.message==='Success'){
                        let userdata = response.activity
                        userdata.uid = userdata.firebaseUID
                        this.props.setUserData(userdata)
                this.props.navigation.navigate("Home")
                    }
                }).catch(err=>{
                    console.log(err)
                })
            }
            else{
            // this.props.navigation.navigate("Language")
            this.setState({
              showSlider:true
            })
            }
        }
        else{
            // this.props.navigation.navigate("Language")
            this.setState({
              showSlider:true
            })
        }
       }).catch(err=>console.log(err))
    }
          _renderItem = ({ item }) => {
        return (
          <View style={styles.slide}>
            <Image style={styles.image} source={item.image} />
          </View>
        );
      }
      _onDone = () => {
        // User finished the introduction. Show real app through
        // navigation or simply by controlling state
        this.props.navigation.navigate('Language')
        this.setState({ showSlider: false });
      }
    render() {
      if(this.state.showSlider===false)
      {

        return (
            <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
                 <View style={{alignItems:'center',marginTop:2,width:wp('100%'),height:(this.state.orientation==="portrait")?hp('45%'):hp('88.5%')}}>
          <Image 
          source={require('./icon.jpeg')}
          style={{width:wp('80%'),height:(this.state.orientation==="portrait")?hp('45%'):hp('89%')}}
          />
          </View>
                    <Text style={{fontSize:20,textAlign:"center",fontWeight:"bold"}}>شالا مسافر کوئی نہ تھیوے ککھ جنہاں توں بھارے ہُو</Text>
                    <Text style={{fontSize:20,textAlign:"center",fontWeight:"bold"}}>تاڑی مار اڈاؤ نہ باہو،اساں آپے اُڈن ہارے ہُو</Text>

                    <ActivityIndicator animating size={Platform.OS==='android'?30:1} color='darkorange'/>

            </View>
        )
      }
      else{
    return (
      <AppIntroSlider  renderItem={this._renderItem} slides={slides} onDone={this._onDone}/>
    );
  }
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
       }
    })
  }
  export default connect(mapStateToProps,mapActionsToProps)(Splash)

// import React, { Component } from 'react'
// import { Text, View,StyleSheet,Image } from 'react-native'
// import AppIntroSlider from 'react-native-app-intro-slider';
// import PDFView from 'react-native-view-pdf';

// const resources = {
//   file: Platform.OS === 'ios' ? 'downloadedDocument.pdf' : '/sdcard/Download/downloadedDocument.pdf',
//   url: 'https://www.ieee-pes.org/images/files/pdf/pg4-sample-conference-paper.pdf',
//   base64: 'JVBERi0xLjMKJcfs...',
// };
// const styles = StyleSheet.create({
//     mainContent: {
//       flex: 1,
//       alignItems: 'center',
//       justifyContent: 'space-around',
//     },
//     image: {
//       width: 320,
//       height: 320,
//     },
//     text: {
//       color: 'rgba(255, 255, 255, 0.8)',
//       backgroundColor: 'transparent',
//       textAlign: 'center',
//       paddingHorizontal: 16,
//     },
//     title: {
//       fontSize: 22,
//       color: 'white',
//       backgroundColor: 'transparent',
//       textAlign: 'center',
//       marginBottom: 16,
//     },
//   });
// const slides = [
//     {
//       key: 'somethun',
//       title: 'Title 1',
//       text: 'Description.\nSay something cool',
//       image: require('./icon.jpeg'),
//       backgroundColor: '#59b2ab',
//     },
//     {
//       key: 'somethun-dos',
//       title: 'Title 2',
//       text: 'Other cool stuff',
//       image: require('./2.png'),
//       backgroundColor: '#febe29',
//     },
//     {
//       key: 'somethun1',
//       title: 'Rocket guy',
//       text: 'I\'m already out of descriptions\n\nLorem ipsum bla bla bla',
//       image: require('./3.png'),
//       backgroundColor: '#22bcb5',
//     }
//   ];
// export default class Splash extends Component {
//     constructor(props){
//         super(props)
//         this.state = {
//             showRealApp: false
//           }
//     }
//       _renderItem = ({ item }) => {
//         return (
//           <View style={styles.slide}>
//             <Text style={styles.title}>{item.title}</Text>
//             <Image source={item.image} />
//             <Text style={styles.text}>{item.text}</Text>
//           </View>
//         );
//       }
//       _onDone = () => {
//         // User finished the introduction. Show real app through
//         // navigation or simply by controlling state
//         this.setState({ showRealApp: true });
//       }
//       render() {
//         if (this.state.showRealApp) {
//           return <App />;
//         } else {
//           return <AppIntroSlider renderItem={this._renderItem} slides={slides} onDone={this._onDone}/>;
//         }
//       }
// }
// With Flow type annotations (https://flow.org/)

// export default class Splash extends React.Component {
//   render() {
//     const resourceType = 'url';

//     return (
//       <View style={{ flex: 1 }}>
//         {/* Some Controls to change PDF resource */}
//         <PDFView
//           fadeInDuration={250.0}
//           style={{ flex: 1 }}
//           resource={resources[resourceType]}
//           resourceType={resourceType}
//           onLoad={() => {
//             setTimeout(() => {
//                 this.props.navigation.navigate('Login')
//             }, 5000);
//           }}
//           onError={(error) => console.log('Cannot render PDF', error)}
//         />
//       </View>
//     );
//   }
// }
