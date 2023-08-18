import logo from './logo.svg';
import './App.css';
import chatIcon from './chat2.png'
import React, { useState, StyleSheet, useContext, useRef, useEffect } from 'react';
import AgoraUIKit, { PropsContext, RtcContext, popUpStateEnum, rtmStatusEnum } from 'agora-react-uikit';
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

  const rtcPropst = {
    appId: '1e07c1131da141dd8734a2fa01e82955',
    channel: 'test', // your agora channel
    //token: null //'<Your channel Token>' use null or skip if using app in testing mode
  };
  const {rtcProps, rtmProps} = useContext(PropsContext);
const [messageList, setMessageList] = useState([])
const timerValueRef = useRef(5)
const localUid = useRef('')
const rtmClient = useClient(rtcPropst.appId)
const channel = useChannel(rtmClient, rtcPropst.channel)
const {
  localUid:rtcUid,
  localAudioTrack,
  localVideoTrack,
  dispatch,
  channelJoined
} = useContext(RtcContext)


const login = async () => {
  console.log("login")

  const { tokenUrl } = rtcProps
  if (tokenUrl) {
    try {
      const res = await fetch(
        tokenUrl + '/rtm/' + (rtmProps?.uid || String(localUid.current))
      )
      const data = await res.json()
      const serverToken = data.rtmToken
      await rtmClient.login({
        uid: rtmProps?.uid || String(localUid.current),
        token: serverToken
      })
      console.log("login S")

      timerValueRef.current = 5
    } catch (error) {
      setTimeout(async () => {
        timerValueRef.current = timerValueRef.current + timerValueRef.current
        login()
      }, timerValueRef.current * 1000)
    }
  } else {
    try {
      await rtmClient.login({
        uid: rtmProps?.uid || String(localUid.current),
        token: rtmProps?.token || undefined
      })
      timerValueRef.current = 5
      console.log("login S")

    } catch (error) {
      setTimeout(async () => {
        timerValueRef.current = timerValueRef.current + timerValueRef.current
        login()
      }, timerValueRef.current * 1000)
    }
  }
}

const joinChannel = async () => {
  try {
    await channel.join()
    console.log("joinChannel")
    timerValueRef.current = 5
  } catch (error) {
    setTimeout(async () => {
      timerValueRef.current = timerValueRef.current + timerValueRef.current
      joinChannel()
    }, timerValueRef.current * 1000)
  }
}

const init = async () => {
  //setRtmStatus(rtmStatusEnum.initialising)
  // rtmProps?.uid
  //   ? (localUid.current = String(rtmProps.uid))
  //   :
  console.log("init agora",rtcProps.uid,rtcProps.channel, String(rtcProps.uid),localUid.current)
  rtcProps.uid
    ? (localUid.current = String(rtcProps.uid))
    : (localUid.current = String(timeNow()))

  rtmClient.on('ConnectionStateChanged', (state, reason) => {
    console.log(state, reason)
  })

  rtmClient.on('TokenExpired', async () => {
    const { tokenUrl } = rtcProps
    console.log('token expired - renewing')
    if (tokenUrl) {
      try {
        const res = await fetch(
          tokenUrl + '/rtm/' + (rtmProps?.uid || localUid.current)
        )
        const data = await res.json()
        const serverToken = data.rtmToken
        await rtmClient.renewToken(serverToken)
        timerValueRef.current = 5
      } catch (error) {
        console.error('TokenExpiredError', error)
      }
    }
  })

  rtmClient.on('MessageFromPeer', (message, peerId) => {
    //handleReceivedMessage(message, peerId)
  })

  channel.on('ChannelMessage', (message, peerId) => {
    //handleReceivedMessage(message, peerId)
  })

  channel.on('MemberJoined', async (peerId) => {
   // await sendPeerMessage(createUserData(), peerId)
  })
  channel.on('MemberCountUpdated', async (count) => {
    console.log('RTM-MemberCountUpdated: ', count)
  })

  // handle RTM callbacks
  // if (rtmCallbacks?.channel) {
  //   Object.keys(rtmCallbacks.channel).map((callback) => {
  //     if (rtmCallbacks.channel) {
  //       channel.on(
  //         callback as keyof RtmEvents.RtmChannelEvents,
  //         rtmCallbacks.channel[callback]
  //       )
  //     }
  //   })
  // } else if (rtmCallbacks?.client) {
  //   Object.keys(rtmCallbacks.client).map((callback) => {
  //     if (rtmCallbacks.client) {
  //       rtmClient.on(
  //         callback as keyof RtmEvents.RtmClientEvents,
  //         rtmCallbacks.client[callback]
  //       )
  //     }
  //   })
  // }

  // if (rtcProps.tokenUrl) {
  //   const { tokenUrl, uid } = rtcProps
  //   rtmClient.on('TokenExpired', async () => {
  //     console.log('token expired')
  //     const res = await fetch(tokenUrl + '/rtm/' + (uid || 0) + '/')
  //     const data = await res.json()
  //     const token = data.rtmToken
  //     rtmClient.renewToken(token)
  //   })
  // }

  // setRtmStatus(rtmStatusEnum.loggingIn)
   await login()
  // setRtmStatus(rtmStatusEnum.loggedIn)
   await joinChannel()
  // setRtmStatus(rtmStatusEnum.connected)
  // // console.log('!rtcUid', rtcUid, channelJoined)
  // setUsernames((p) => {
  //   return { ...p, 0: rtmProps?.username }
  // })
  // sendChannelMessage(createUserData())
}



useEffect(() => {
  const setupRtm = async () => {
    console.log("USEEFFCAT Call",rtcProps.channel,"rtcProps.appID",rtcProps.channel)
    await init();
    };
  setupRtm();
  return () => {
   // end();
  };
  // if (channelJoined) {
  //   init()
  //  // setLoggedIn(true)
  // }
  // return () => {
  //   if (channelJoined) {
  //    // end()
  //   }
  // }

 }, [rtcProps.channel,rtcProps.appId,rtcProps.channelJoined]);

  const [videoCall, setVideoCall] = useState(true);
  const [isChatEnabel,setChatEnabel]=useState(false)


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

  const sendChannelMessage = async (payload) => {
    const text={message:payload,id:(new Date()).getTime()}

    const message = rtmClient.createMessage({
      text: JSON.stringify(text),
      messageType: AgoraRTM.MessageType.TEXT
    })
    try {
      await channel.sendMessage(message)
    } catch (e) {
      console.error(e)
    }
  }
  const sentMessage=(message)=>{
    const text={message:message,id:(new Date()).getTime()}
    const rtmMessage={
     
      text:JSON.stringify(text),
      messageType:112,
    }
    
    //if(props.sentMessage) props.sentMessage(message)
   }
  const handChatEnabel=()=>{
    setChatEnabel(!isChatEnabel)
  }
   let chatUi=    null
  if(isChatEnabel){
      chatUi=<div style={{
        flex: 1,
    position: 'absolute',
    borderTopLeftRadius:30,
    borderTopRightRadius:30,
    //  left: 0,
    //  top: 0,
    
    right: 0, bottom: 70,
    opacity: 0.5,
    width:350,
    marginRight:40,
    backgroundColor: 'black',
    } }>
       <Goals sentMessage={sendChannelMessage} goalList={messageList} ></Goals>
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
        <AgoraUIKit rtcProps={rtcPropst} callbacks={callbacks} rtmCallbacks={rtmCallback} />
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


