import EditBioForm from './EditBio.js'
import { getEntryFromDb } from '../../database.js'

const Bio = async () => {
  const userInfo = await getEntryFromDb('bio') || []
  return `
  <section class="bio">
    <div class="profile-photo">
      <img src="https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg" alt="profile-photo">
    </div>
    <div class="profile-info">
      <p class="name">${userInfo[0] ? userInfo[0].name : 'Please update your bio'}</p>
      <p class="about">${userInfo[0]? userInfo[0].about : ''}</p>
      <button class="edit-bio-button"}>Edit bio</button>

    </div>
    ${EditBioForm()}
  </section>
`}

export default Bio
