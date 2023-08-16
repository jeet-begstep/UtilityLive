import logo from './logo.svg';
import './App.css';

import React, {useState,StyleSheet, useContext} from 'react';
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
 
 
 

const timeNow = () => new Date().getTime()
const useChannel = createLazyChannel()
const useClient = createLazyClient()
/**
 * React component that contains the RTM logic. It manages the usernames, remote mute requests and provides data to the children components by wrapping them with context providers.
 */

 
const App = () => {
  

 

  
  
   
  const [videoCall, setVideoCall] = useState(true);
  
  const rtcProps = {
    appId: '1e07c1131da141dd8734a2fa01e82955',
    channel: 'test', // your agora channel
    //token: null //'<Your channel Token>' use null or skip if using app in testing mode
  };
  const callbacks = {
    EndCall: () => setVideoCall(false),
  };
  
  const rtmCallback ={
    }
  return videoCall ? (
    <div style={{display: 'flex', width: '100vw', height: '100vh'}}>
      <AgoraUIKit rtcProps={rtcProps} callbacks={callbacks}   />
    </div>
  ) : (
    <div style={{borderRadius:30,margin:30,backgroundColor:"blue"}}>
      <h3 style={{color:"white",paddingVertical:8,paddingHorizontal:16,textAlign:"center"}}  onClick={() => setVideoCall(true)}>Start Call</h3>
    </div>
  );
};

export default App;

 
 