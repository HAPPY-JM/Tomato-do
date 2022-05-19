import { initDatabase, addEntryToDb, getEntryFromDb, updateEntryToDb, checkEntryFromDb, deleteEntryFromDb } from "./database.js"
import { testDb } from "./database.js"

const loadName = async ()=>{  
        
    const dbkey = await getEntryFromDb("userInfo",{type:"name"});
    if(dbkey){if(dbkey.type)inputName.value = dbkey.userName;}   
    // else{console.log("이름 데이터 없음")} 
}
const editNameEnter = async (key) =>{
    if(key.keyCode == 13){
        editName();
    }
}
const editName = async () =>{
        if(inputName.value===""){
            loadName();
        }else{
        const namesInDbArr = await getEntryFromDb('userInfo',{type:"name"});
        const inputNameValue = inputName.value;

        if(namesInDbArr){
            await deleteEntryFromDb('userInfo',{type:"name"});
            await addEntryToDb('userInfo',{"userName":inputNameValue,"type":"name"})
        }
        else{await addEntryToDb('userInfo',{"userName":inputNameValue,"type":"name"})}
        inputName.blur()
}}
const inputName = document.querySelector('#profile_name');
export { inputName, editName, loadName, editNameEnter }