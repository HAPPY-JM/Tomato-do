import { addEntryToDb,getEntryFromDb, deleteEntryFromDb} from "./database.js"
/*
index.html의 적용 시킬 내용
<label className="input-file-button" for="input-file">
    <img id="input-photo" src="./img/profile_pic.jpg" alt="profile_pic" style="width: 40px; border-radius: 100%;">
</label>
<input type="file" id="input-file" style="display:none">
*/

//-----------------------------------------------------------------------------------------------------------------

/*
userInfo 에 username이랑 userImg를 같이 넣을때 사용할 코드
-> !!!!!문제 발생!!!! : 이렇게 하면 이름을 넣는 코드랑 충돌 발생, 이름을 넣는 코드에서 마지막 데이터를 가져오기 때문에 
   마지막 데이터가 이름 데이터가 아닐때 undefined라고 뜸.
   해결 방안 1.userInfo에 username 이랑 userImg를 같이 저장하지 말고, username는 userInfo에 userImg는 profile이라는 스토어를 또 만들어서 거기다가 저장.
   (장점 : 수정할 코드가 적음. 단점 : 스토어를 하나 더 만들게 됨.)
   해결 방안 2.inputName.js의 마지막 데이터를 가져오는게 아니라 type에 name같은 문자를 저장해줘서 name에 해당하는 데이터를 가져옴.
   (장점 : 코드가 줄어듦)
*/
const addPictureEventListener =  () =>{
    const photoInput = document.querySelector("#input-file")
    const photoSection =document.querySelector("#input-photo")

    photoInput.addEventListener("change",()=>{
        const reader = new FileReader();
        reader.readAsDataURL(photoInput.files[0])

        reader.addEventListener("load",()=>{
            const photoUrl = reader.result;
            const photodata = {"userImg":photoUrl,"type":"imageUrl2"}
             deleteEntryFromDb("userInfo",{type:"imageUrl2"})
             addEntryToDb("userInfo",photodata)
            
            photoSection.src = photoUrl;
        })
    })
}

// 저장한 이미지 프로필 이미지 사진이 있다면 프로필 이미지 사진을 보여주게 함.
const loadProfilePic = async () => {
    const photoSection =document.querySelector("#input-photo")      
    const dbkey = await getEntryFromDb("userInfo",{type:"imageUrl2"});
    
    if(dbkey){
        if(dbkey.type){photoSection.src = dbkey.userImg;}
    }
    // else{console.log("이미지 없음")}
    
}

export { addPictureEventListener,loadProfilePic }
