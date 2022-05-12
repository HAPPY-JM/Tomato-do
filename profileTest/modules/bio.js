//프로필이미지, 이름, 자기소개 를 표현할 html을 보내줌.
import EditBio from './EditBio.js'
// getEntryFromDb -> 저장된 데이터들을 받아올 함수
import {getEntryFromDb} from '../ProfileDB.js'

// getEntryFromDb는 Promise가 사용하기 때문에 비동기 처리를 해줘야 한다.
// 비동기 처리를 하지 않으면 의도는 수정한것을 그대로 보여줘야 하는데 
// 데이터를 읽는것보다 보여주는게 먼저 되서 아무것도 없는 상태로 보여짐
const Bio = async ()=> {
    // userInfo에 profile의 데이터 들을 가져옴(id값이 없으므로 모두 가져옴)
    const userInfo =  await getEntryFromDb('profile') || [];
    
    // BIO라는 함수가 넣어야할 html들을 보내줌.
    // 첫번째 ${}안의 내용 : profile의 첫번째 데이터가 있다면 그 데이터의 이름을 아니면 'please update your bio'라는 말을 보여줌
    // 두번째 ${}안의 내용 : profile의 첫번째 데이터가 있다면 그 데이터의 자기소개(about)을 아니면 'please update your bio'라는 말을 보여줌
    
   return `<section class="bio">
    <div class="profile-photo">
    <img src="https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg" alt="profile-photo">
    </div>
    <div class="profile-info">
    <p class="name"> ${userInfo[0] ? userInfo[0].name : 'please update your bio'} </p>
    <p class="about"> ${userInfo[0] ? userInfo[0].about : 'please update your bio'}</p>    
    <button class="edit-bio-button"}>Edit bio</button>
    </div>
    ${EditBio()}
    </section>
    `
}

export default Bio;