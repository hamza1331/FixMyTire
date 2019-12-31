/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable*/
import React, { Component } from "react";
import { GiftedChat, Bubble,Send } from "react-native-gifted-chat";
import {
    View,
    Text,
    Platform,
    PermissionsAndroid,
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView
} from "react-native";
import { AudioRecorder, AudioUtils } from "react-native-audio";
import propTypes from "prop-types";
import { RNS3 } from "react-native-aws3";
import Ionicons from "react-native-vector-icons/MaterialCommunityIcons";
import Sound from "react-native-sound";
import { firebaseDB } from "../config/FirebaseConfig";
import AwsConfig from "../config/AwsConfig"
import { connect } from 'react-redux';
const ImagePicker = require("react-native-image-picker");

class Chat extends Component {
    static propTypes = {
        user: propTypes.object,
    };
    state = {
        messages: [],
        startAudio: false,
        hasPermission: false,
        audioPath: `${
            AudioUtils.DocumentDirectoryPath
            }/${this.messageIdGenerator()}test.aac`,
        playAudio: false,
        fetchChats: false,
        audioSettings: {
            SampleRate: 22050,
            Channels: 1,
            AudioQuality: "Low",
            AudioEncoding: "aac",
            MeteringEnabled: true,
            IncludeBase64: true,
            AudioEncodingBitRate: 32000
        }
    };
    componentWillMount() {
        console.log(AwsConfig, "awsconfig")
        console.log(this.props, "chat props")
        this.chatsFromFB = firebaseDB.ref(`/chat/${this.props.chat}`);
        console.log(this.chatsFromFB, "chats from fb")
        this.chatsFromFB.on("value", snapshot => {
            console.log(snapshot.val(), "snap shot")
            if (!snapshot.val()) {
                this.setState({
                    fetchChats: true
                });
                return;
            }
            let { messages } = snapshot.val();
            messages = messages.map(node => {
                const message = {};
                message._id = node._id;
                message.text = node.messageType === "message" ? node.text : "";
                message.createdAt = node.createdAt;
                message.user = {
                    _id: node.user._id,
                    name: node.user.name,
                    avatar: node.user.avatar
                };
                message.image = node.messageType === "image" ? node.image : "";
                message.audio = node.messageType === "audio" ? node.audio : "";
                message.messageType = node.messageType;
                return message;
            });
            this.setState({
                messages: [...messages]
            });
        });
    }
    componentDidMount() {
        this.checkPermission().then(async hasPermission => {
            this.setState({ hasPermission });
            if (!hasPermission) return;
            await AudioRecorder.prepareRecordingAtPath(
                this.state.audioPath,
                this.state.audioSettings
            );
            AudioRecorder.onProgress = data => {
                console.log(data, "onProgress data");
            };
            AudioRecorder.onFinished = data => {
                console.log(data, "on finish");
            };
        });
    }
    componentWillUnmount() {
        this.setState({
            messages: []
        });
    }

    checkPermission() {
        if (Platform.OS !== "android") {
            return Promise.resolve(true);
        }
        const rationale = {
            title: "Microphone Permission",
            message:
                "AudioExample needs access to your microphone so you can record audio."
        };
        return PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
            rationale
        ).then(result => {
            console.log("Permission result:", result);
            return result === true || result === PermissionsAndroid.RESULTS.GRANTED;
        });
    }
   async onSend(messages = []) {
        messages[0].messageType = "message";
        this.chatsFromFB.update({
            messages: [messages[0], ...this.state.messages]
        });
        this.checkPermission().then(async hasPermission => {
            this.setState({ hasPermission });
            if (!hasPermission) return;
            await AudioRecorder.prepareRecordingAtPath(
                this.state.audioPath,
                this.state.audioSettings
            );
            AudioRecorder.onProgress = data => {
                console.log(data, "onProgress data");
            };
            AudioRecorder.onFinished = data => {
                console.log(data, "on finish");
            };
        });
    }
    // renderName = props => {
    //     const { user: self } = this.props; // where your user data is stored;
    //     const { user = {} } = props.currentMessage;
    //     const { user: pUser = {} } = props.previousMessage;
    //     const isSameUser = pUser._id === user._id;
    //     const shouldNotRenderName = isSameUser;
    //     let firstName = user.name.split(" ")[0];
    //     let lastName = user.name.split(" ")[1][0];
    //     return shouldNotRenderName ? (
    //         <View />
    //     ) : (
    //             <View>
    //                 <Text style={{ color: "grey", padding: 2, alignSelf: "center" }}>
    //                     {`${firstName} ${lastName}.`}
    //                 </Text>
    //             </View>
    //         );
    // };
    renderAudio = props => {
        return !props.currentMessage.audio ? (
            <View />
        ) : (
                <Ionicons
                    name="play-circle"
                    size={35}
                    color={this.state.playAudio ? "red" : "darkorange"}
                    style={{
                        left: 90,
                        position: "relative",
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 0 },
                        shadowOpacity: 0.5,
                        backgroundColor: "transparent"
                    }}
                    onPress={() => {
                        this.setState({
                            playAudio: true
                        });
                        const sound = new Sound(props.currentMessage.audio, "", error => {
                            if (error) {
                                console.log("failed to load the sound", error);
                            }
                            this.setState({ playAudio: false });
                            sound.play(success => {
                                console.log(success, "success play");
                                if (!success) {
                                    Alert.alert("There was an error playing this audio");
                                }
                            });
                        });
                    }}
                />
            );
    };
    renderBubble = props => {
        return (
            <View>

                {this.renderAudio(props)}
                <Bubble {...props} wrapperStyle={{
          right: {
      backgroundColor: 'darkorange',
    },
    left:{
      backgroundColor:'#e6e6e6',
    }
        }}
        textProps={{
          style: {
            color: props.position === 'left' ? '#000' : '#fff',
          },
        }} />
            </View>
        );
    };
    renderCustomActions = ()=>{
        return(
            <View style={{ flexDirection: "row",
            justifyContent: "space-between"}}>

            <Ionicons
                    name="microphone"
                    size={40}
                    color={this.state.startAudio ? "red" : "darkorange"}
                    style={{
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 0 },
                        shadowOpacity: 0.5,
                        backgroundColor: "transparent",
                    }}
                    onPress={this.handleAudio}
                />
                </View>
        )
    }
    handleAvatarPress = props => {
        // add navigation to user's profile
    };
    handleAudio = async () => {
        if (!this.state.startAudio) {
            this.setState({
                startAudio: true
            });
            await AudioRecorder.startRecording();
        } else {
            this.setState({ startAudio: false });
            await AudioRecorder.stopRecording();
            const { audioPath } = this.state;
            const fileName = `${this.messageIdGenerator()}.aac`;
            const file = {
                uri: Platform.OS === "ios" ? audioPath : `file://${audioPath}`,
                name: fileName,
                type: `audio/aac`
            };
            const options = {
                keyPrefix: AwsConfig.keyPrefix,
                bucket: AwsConfig.bucket,
                region: AwsConfig.region,
                accessKey: AwsConfig.accessKey,
                secretKey: AwsConfig.secretKey,
            };
            RNS3.put(file, options)
                .progress(event => {
                    console.log(`percent: ${event.percent}`);
                })
                .then(response => {
                    console.log(response, "response from rns3 audio");
                    if (response.status !== 201) {
                        alert("Something went wrong, and the audio was not uploaded.");
                        console.error(response.body);
                        return;
                    }
                    const message = {};
                    message._id = this.messageIdGenerator();
                    message.createdAt = Date.now();
                    message.user = {
                        _id: this.props.userID,
                        name: `${this.props.userInfo.fName}`,
                        avatar: this.props.userInfo.profilePic!==undefined?this.props.userInfo.profilePic:'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg'
                    };
                    message.text = "";
                    message.audio = response.headers.Location;
                    message.messageType = "audio";

                    this.chatsFromFB.update({
                        messages: [message, ...this.state.messages]
                    });
                    this.checkPermission().then(async hasPermission => {
                        this.setState({ hasPermission });
                        if (!hasPermission) return;
                        await AudioRecorder.prepareRecordingAtPath(
                            this.state.audioPath,
                            this.state.audioSettings
                        );
                        AudioRecorder.onProgress = data => {
                            console.log(data, "onProgress data");
                        };
                        AudioRecorder.onFinished = data => {
                            console.log(data, "on finish");
                        };
                    });
                })
                .catch(err => {
                    console.log(err, "err from audio upload");
                });
        }
    };
    messageIdGenerator() {
        // generates uuid.
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
            let r = (Math.random() * 16) | 0,
                v = c == "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }
    sendChatToDB(data) {
        // send your chat to your db
    }
    handleAddPicture = () => {
        const options = {
            title: "Select Profile Pic",
            mediaType: "photo",
            takePhotoButtonTitle: "Take a Photo",
            maxWidth: 256,
            maxHeight: 256,
            allowsEditing: true,
            noData: true
        };
        ImagePicker.showImagePicker(options, response => {
            console.log("Response = ", response);
            if (response.didCancel) {
                // do nothing
            } else if (response.error) {
                // alert error
            } else {
                const { uri } = response;
                const extensionIndex = uri.lastIndexOf(".");
                const extension = uri.slice(extensionIndex + 1);
                const allowedExtensions = ["jpg", "jpeg", "png"];
                const correspondingMime = ["image/jpeg", "image/jpeg", "image/png"];
                const options = {
                    keyPrefix: AwsConfig.keyPrefix,
                    bucket: AwsConfig.bucket,
                    region: AwsConfig.region,
                    accessKey: AwsConfig.accessKey,
                    secretKey: AwsConfig.secretKey,
                };
                const file = {
                    uri,
                    name: `${this.messageIdGenerator()}.${extension}`,
                    type: correspondingMime[allowedExtensions.indexOf(extension)]
                };
                RNS3.put(file, options)
                    .progress(event => {
                        console.log(`percent: ${event.percent}`);
                    })
                    .then(response => {
                        console.log(response, "response from rns3");
                        if (response.status !== 201) {
                            alert(
                                "Something went wrong, and the profile pic was     not uploaded."
                            );
                            console.error(response.body);
                            return;
                        }
                        const message = {};
                        message._id = this.messageIdGenerator();
                        message.createdAt = Date.now();
                        message.user = {
                            _id: this.props.userID,
                            name: `${this.props.userInfo.fName}`,
                            avatar: this.props.userInfo.profilePic!==undefined?this.props.userInfo.profilePic:'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg'
                        };
                        message.image = response.headers.Location;
                        message.messageType = "image";

                        this.chatsFromFB.update({
                            messages: [message, ...this.state.messages]
                        });
                    });
                if (!allowedExtensions.includes(extension)) {
                    return alert("That file type is not allowed.");
                }
            }
        });
    };
    // renderAndroidMicrophone() {
    //     if (Platform.OS === "android") {
    //         return (
    //             <Ionicons
    //                 name="microphone"
    //                 size={45}
    //                 hitSlop={{ top: 20, bottom: 20, left: 50, right: 50 }}
    //                 color={this.state.startAudio ? "red" : "darkgreen"}
    //                 style={{
    //                     bottom: 100,
    //                     right: Dimensions.get("window").width / 2,
    //                     position: "absolute",
    //                     shadowColor: "#000",
    //                     shadowOffset: { width: 0, height: 0 },
    //                     shadowOpacity: 0.5,
    //                     zIndex: 2,
    //                     backgroundColor: "transparent",
    //                 }}
    //                 onPress={this.handleAudio}
    //             />
    //         );
    //     }
    // }
    renderLoading() {
        if (!this.state.messages.length && !this.state.fetchChats) {
            return (
                <View style={{ marginTop: 100 }}>
                    <ActivityIndicator color="black" animating size="large" />
                </View>
            );
        }
    }


    render() {
        // const { user } = this.props; // wherever you user info is
        const rightButtonConfig = {
            title: 'Add photo',
            handler: () => this.handleAddPicture(),
        };
        return (
            <View style={{ flex: 1 }}>
                {this.renderLoading()}
                <GiftedChat
                    messages={this.state.messages}
                    onSend={messages => this.onSend(messages)}
                    alwaysShowSend
                    showUserAvatar
                    isAnimated
                    showAvatarForEveryMessage
                    renderSend={(props)=>{
                        return (
                          <Send
                              {...props}
                          >
                              <View style={{marginRight: 10, marginBottom: 10}}>
                                <Text style={{color:'darkorange',fontWeight:'bold'}}>Send</Text>
                              </View>
                          </Send>
                      );
                      }}
                    renderBubble={this.renderBubble}
                    messageIdGenerator={this.messageIdGenerator}
                    onPressAvatar={this.handleAvatarPress}
                    renderActions={this.renderCustomActions}
                    user={{
                        _id: this.props.userID,
                        name: `${this.props.userInfo.fName}`,
                    avatar:this.props.userInfo.profilePic!==undefined?this.props.userInfo.profilePic:'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg'

                      }}
                />
                <KeyboardAvoidingView />
            </View>
        );
    }
}
function mapStateToProps(state){
    return({
      isCustomer:state.rootReducer.isCustomer,
      userInfo:state.rootReducer.userInfo,
      userID:state.rootReducer.userID,
      UID:state.rootReducer.UID,
      chat:state.rootReducer.chat
    })
  }
  function mapActionsToProps(dispatch){
    return({
       
    })
  }

  export default connect(mapStateToProps,mapActionsToProps)(Chat)