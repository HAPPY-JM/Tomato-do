import {getEntryFromDb,addEntryToDb} from "./database.js"

const userInput = async()=>{
    // 첫 입장이면 "첫 입장입니다. "라는 메세지를 alert로 띄워주고 
    // 첫 입장이 아니면 "첫 입장이 아닙니다." 라는 메세지를 alert로 띄워줌.
    
    const firstDb = await getEntryFromDb("firstDb",{type:"welcome"});
    if(!firstDb){alert("첫 입장입니다."); addEntryToDb("firstDb",{type:"welcome"})}
    else{alert("첫 입장이 아닙니다.")}
   
}

export {userInput}