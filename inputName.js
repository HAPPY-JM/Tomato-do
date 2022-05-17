import { initDatabase, addEntryToDb, getEntryFromDb, updateEntryToDb, checkEntryFromDb, deleteEntryFromDb } from "./database.js"
import { testDb } from "./database.js"

//마지막 id의 이름 불러오기
/*
const loadName = async ()=>{
    const namesInDbArr = await getEntryFromDb('userInfo'); 
    const nameInDbLast = (namesInDbArr == "") ? 0 : namesInDbArr[namesInDbArr.length-1].id;
    let getLastName="";
    namesInDbArr == 0 ? getLastName = {userName:inputName.placeholder} :  getLastName = await getEntryFromDb('userInfo',{id:nameInDbLast});
    inputName.value = getLastName.userName;
}

//현재 : 이름입력시 그전값은 지우고 새로받은값 하나만 남김
//모두 지우는 방식으로 하면 코드가 더 짧아질수있을 것 같습니다.
const editName = async (key) => {
    
    if(key.keyCode == 13){//입력된 키가 13(엔터)일때 실행
        const namesInDbArr = await getEntryFromDb('userInfo'); 
        const nameInDbLast = (namesInDbArr == "") ? 0 : namesInDbArr[namesInDbArr.length-1].id;

        if (nameInDbLast !== 0){
            const getLastName = await getEntryFromDb('userInfo',{id:nameInDbLast});
            await deleteEntryFromDb('userInfo',{ id : nameInDbLast })
        }
        
        const inputNameValue = inputName.value;
        const nameEntry = { 'userName': inputNameValue };
        await addEntryToDb('userInfo',nameEntry);

        inputName.blur(); //esc누른것처럼 포커스 빼버림 
    }
}
*/
//밑의 방식으로 임의로 수정함.
// type이 name인 값을 부럴와서 있다면 그 이름을 보여줌
const loadName = async ()=>{  
        
    const dbkey = await getEntryFromDb("userInfo",{type:"name"});
    if(dbkey){if(dbkey.type)inputName.value = dbkey.userName;}   
    // else{console.log("이름 데이터 없음")} 
}

const editName = async (key) =>{
    if(key.keyCode == 13){//입력된 키가 13(엔터) 일때 실행
        
        const namesInDbArr = await getEntryFromDb('userInfo',{type:"name"});
        const inputNameValue = inputName.value;

        if(namesInDbArr){
            await deleteEntryFromDb('userInfo',{type:"name"});
            await addEntryToDb('userInfo',{"userName":inputNameValue,"type":"name"})
        }
        else{await addEntryToDb('userInfo',{"userName":inputNameValue,"type":"name"})}

        
        inputName.blur()
    }
}

const inputName = document.querySelector('#profile_name');



export { inputName, editName, loadName }

// const photoUrl = reader.result;
//             const photodata = {"userImg":photoUrl,"type":"imageUrl2"}
//              deleteEntryFromDb("userInfo",{type:"imageUrl2"})
//              addEntryToDb("userInfo",photodata)