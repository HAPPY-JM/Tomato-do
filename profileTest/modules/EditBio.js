// 프로필에 이름과 자기소개를 할 칸을 만들어주는 html
const EditBio = () => {
    console.log("EditBio pass")
    return `
      <form class="edit-bio-form">
        <input type="text" id="name" placeholder="Name" required />
        <input type="text" id="about" placeholder="about" / required> </br>
        <button type="button" class="cancel-edit-bio">Cancel</button>
        <button type="submit">Submit</button>
      </form>
    `
  }
  
  export default EditBio