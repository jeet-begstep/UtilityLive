  import React from "react";
  import './goal-list.css';
import imageProfile from '../user_profile.png'
import icSent from '../ic_sent.png'

  const Goals=(goalList)=>{
    console.log(goalList)
    return  <div>
      <ul className="goal-list">
    {
  
  goalList.goalList.map((item) => {
    return (<div style={{display:"flex",flexDirection:"row", margin:16}} >
        <img src={imageProfile} style={{width:32,height:32}}></img>
        <span style={{marginInlineStart:16,color:"white"}}>{item.name+":  "+item.message}</span>
    </div>)
})
         // goalList.goalList.map((goal)=>{
        //   return  <li key={goal.id}>{goal.message}</li>
        // })
      }
  </ul>
  
  // <div style={{display:"flex", flexDirection: "row", justifyContent: "flex-start" }}>
  <input style={{height:30 ,width:"70%", marginInlineStart:20,marginRight:8}}  />
  {/* <Button title="slkdf"><Image src="../assets/images/chat.png"></Image></Button> */}
  <div style={{justifyContent:"center",marginBottom:8,}} onPress={() => {  }}>
      <div>
          <img    src={icSent}/>
      </div>
  </div>
</div>
    </div>


  }
  export default Goals;
