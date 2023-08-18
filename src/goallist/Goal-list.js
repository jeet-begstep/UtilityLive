import React, { useState } from "react";
import './goal-list.css';
import imageProfile from '../user_profile.png'
import icSent from '../ic_sent.png'

const Goals = (porps) => {
  console.log(porps)

  const onSent = () => {
    console.log(inputTextValue)
    porps.sentMessage(inputTextValue)
    onReset()
  }
  const onReset = () => {
    setInputText('');
  }
  const [inputTextValue, setInputText] = useState("")
  const textChangeHandler = (value) => {
    setInputText(value)
  }
  return <div>
    <ul className="goal-list">
      {
        //i was working on some urgent issue now i am looking into this 
        porps.goalList.map((item) => {
          return (<li style={{ height: '10px', border: '1px solid black',paddingBlockStart:0,paddingInlineStart:0 }}>
            <div style={{ display: "flex", flexDirection: "row", }} >
              <img src={imageProfile} style={{ width: 32, height: 32, }}></img>
              <span style={{ marginInlineStart: 16, color: "white" }}>{item.name + ":  " + item.message}</span>
            </div>
          </li>)
        })
        // goalList.goalList.map((goal)=>{
        //   return  <li key={goal.id}>{goal.message}</li>
        // })
      }
    </ul>

  // <div style={{ display: "flex", flexDirection: "row", justifyContent: "flex-start" }}>
      <input style={{ height: 30, width: "70%", marginInlineStart: 20, marginRight: 8 }} value={inputTextValue} onChange={e => textChangeHandler(e.target.value)} />
      {/* <Button title="slkdf"><Image src="../assets/images/chat.png"></Image></Button> */}
      <div style={{ justifyContent: "center", marginBottom: 8, }} onClick={onSent}>
        <div>
          <img src={icSent} />
        </div>
      </div>
    </div>
  </div>


}
export default Goals;
