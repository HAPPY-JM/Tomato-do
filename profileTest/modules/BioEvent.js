// Bio관련한 이벤트 구현한 코드
import { addEntryToDb, clearAllEntries } from '../ProfileDB.js';
// addEntryToDb(storname,entry) => 스토어에 데이터를 저장 
// clearAllEntries => 스토어에 저장된 데이터들을 모두 삭제

// 아래내용들은 쿼리 선택자를 선택해서 이벤트를 단다는 내용임.
const addBioEventListeners = () => {
    const editBioButton = document.querySelector('.edit-bio-button')
    const editBioForm = document.querySelector('.edit-bio-form')
    const cancelFormButton = document.querySelector('.cancel-edit-bio')
  
    editBioButton.addEventListener('click', () => {
      editBioForm.style.display = 'block'
    })
  
    editBioForm.addEventListener('submit', () => {
      // 입력한 이름과 자기소개 내용을 name,about에 저장함. 자기소개 = about임
      const name = document.querySelector('#name').value
      const about = document.querySelector('#about').value
  
      const nameElement = document.querySelector('.name')
      const aboutElement = document.querySelector('.about')
      clearAllEntries('profile')
      // name과 about에 해당하는 값을 bio 테이블에 저장함.
      addEntryToDb('profile', {name,about})
      
      // 저장한 내용들을 요소선택자를 사용해서 넣음.
      nameElement.innerText = name
      aboutElement.innerText = about
      
      // 밑의 내용은 제출 하면서 넣는칸이 없어지게 하려는 의도로 만듬.
      editBioForm.style.display = 'none'
    })
  
    cancelFormButton.addEventListener('click', () => {
    // 밑의 내용은 취소 하면서 넣는칸이 없어지게 하려는 의도로 만듬.
      editBioForm.style.display = 'none'
    })
  }
  
  export default addBioEventListeners
  
