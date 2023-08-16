import logo from './logo.svg';
import './App.css';
import chatIcon from './chat2.png'
import React, { useState, StyleSheet, useContext } from 'react';
import AgoraUIKit, { PropsContext, popUpStateEnum, rtmStatusEnum } from 'agora-react-uikit';
import {
  AgoraVideoPlayer,
  createClient,
  createMicrophoneAndCameraTracks,
  ClientConfig,
  IAgoraRTCRemoteUser,
  ICameraVideoTrack,
  IMicrophoneAudioTrack,
} from "agora-rtc-react";
// define config for rtc engine
import AgoraRTM, {
  createLazyClient,
  createLazyChannel,
  RtmEvents,
  RtmMessage
} from 'agora-rtm-react'
import Goals from './goallist/Goal-list';




const timeNow = () => new Date().getTime()
const useChannel = createLazyChannel()
const useClient = createLazyClient()
/**
 * React component that contains the RTM logic. It manages the usernames, remote mute requests and provides data to the children components by wrapping them with context providers.
 */


const App = () => {



  const [messageList, setMessageList] = useState([{id:235324,message:"sdfsdkf"}])




  const [videoCall, setVideoCall] = useState(true);
  const [isChatEnabel,setChatEnabel]=useState(false)

  const rtcProps = {
    appId: '1e07c1131da141dd8734a2fa01e82955',
    channel: 'test', // your agora channel
    //token: null //'<Your channel Token>' use null or skip if using app in testing mode
  };
  const callbacks = {
    EndCall: () => setVideoCall(false),
  };
  const rtmClientCallback = {
    MessageFromPeer: (
      message,
      peerId,
      messageProps
    ) => {

    },

    ConnectionStateChanged: (
      newState,
      reason
    ) => {

    },

    RemoteInvitationReceived: (remoteInvitation) => {

    },


    TokenExpired: () => {

    },


    PeersOnlineStatusChanged: (status) => {

    }

  }
  const rtmChannelCallback = {
    ChannelMessage: (
      message,
      memberId,
      messagePros
    ) => {
      console.log("ChannelMessage", memberId, messagePros)
      console.log("ChannelMessageReceived", message, messagePros)
      const mess = JSON.parse(message.text);
      mess.name = memberId
      setMessageList((prevMessage) => { return prevMessage.concat(mess) });
    },
    MemberLeft: (memberId) => {
      console.log("MemberLeft", memberId)

    }
    ,

    MemberJoined: (memberId) => {
      console.log("MemberJoined", memberId)

    }
    ,
    AttributesUpdated: (attributes) => {
      console.log("AttributesUpdated", attributes)

    },
    MemberCountUpdated: (memberCount) => {
      console.log("rtmCallback Call", "MemberCountUpdated :", memberCount)

    }
  }
  const handChatEnabel=()=>{
    setChatEnabel(!isChatEnabel)
  }
   let chatUi=    null
  if(isChatEnabel){
      chatUi=<div style={{
        flex: 1,
    position: 'absolute',
    //  left: 0,
    //  top: 0,
    right: 0, bottom: 70,
    opacity: 0.5,
    width:350,
    marginRight:40,
    backgroundColor: 'black',
    } }>
       <Goals goalList={messageList} ></Goals>
       </div>
  }else{
    chatUi=null
  }
  const rtmCallback = {
    channel: rtmChannelCallback
  }
  return videoCall ? (
    <div>
      <div style={{ display: 'flex', width: '100vw', height: '100vh' }}>
        <AgoraUIKit rtcProps={rtcProps} callbacks={callbacks} rtmCallbacks={rtmCallback} />
        {chatUi}
      </div>
      <div  style={{position:"absolute",bottom:0,right:"10%" ,zIndex:30}}>
      <img onClick={() => handChatEnabel()} style={{width:48, height:48}}
          src={chatIcon}//"..//chat2.png"
        >

        </img>
       </div>
    </div>

  ) : (
    <div style={{ borderRadius: 30, margin: 30, backgroundColor: "blue" }}>
      <h3 style={{ color: "white", paddingVertical: 8, paddingHorizontal: 16, textAlign: "center" }} onClick={() => setVideoCall(true)}>Start Call</h3>
    </div>
  );
};

export default App;


