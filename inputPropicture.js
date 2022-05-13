
import { addEntryToDb } from "./database.js"
/*
index.html의 적용 시킬 내용
<label className="input-file-button" for="input-file">
    <img src="./img/profile_pic.jpg" alt="profile_pic" style="width: 40px; border-radius: 100%;">
</label>
<input type="file" id="input-file" style="display:none">
*/

const addPictureEventListener = () =>{
    console.log("addpictureevent 동작")
    const photoInput = document.querySelector("#input-file")
    const photoSection =document.querySelector("#input-photo")

    photoInput.addEventListener("change",()=>{
        const reader = new FileReader();
        reader.readAsDataURL(photoInput.files[0])

        reader.addEventListener("load",()=>{
            const photoUrl = reader.result;
            const photodata = {"userpicture":photoUrl}
            addEntryToDb("profile",photodata)
            
            photoSection.src = photoUrl;
        })
    })
}


export { addPictureEventListener }