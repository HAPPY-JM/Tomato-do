import { addEntryToDb, clearAllEntries } from '../../database.js';

const addBioEventListeners = () => {
  const editBioButton = document.querySelector('.edit-bio-button')
  const editBioForm = document.querySelector('.edit-bio-form')
  const cancelFormButton = document.querySelector('.cancel-edit-bio')

  editBioButton.addEventListener('click', () => {
    editBioForm.style.display = 'block'
  })

  editBioForm.addEventListener('submit', () => {

    const name = document.querySelector('#name').value
    const about = document.querySelector('#about').value
    const nameElement = document.querySelector('.name')
    const aboutElement = document.querySelector('.about')
    clearAllEntries('bio')
    addEntryToDb('bio', { name, about })
    nameElement.innerText = name
    aboutElement.innerText = about
    editBioForm.style.display = 'none'
  })

  cancelFormButton.addEventListener('click', () => {
    editBioForm.style.display = 'none'
  })
}

export default addBioEventListeners
