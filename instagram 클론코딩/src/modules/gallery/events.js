import { addEntryToDb, getEntryFromDb } from '../../database.js'

const addGalleryEventListeners = () => {
  const photoInput = document.querySelector('#addPhotoInput')
  const gallerySection = document.querySelector('.gallery')
  photoInput.addEventListener('change', () => {
    const reader = new FileReader()
    reader.readAsDataURL(photoInput.files[0])

    reader.addEventListener('load', () => {
      addEntryToDb('gallery', reader.result)

      const newItem = `
      <a href="#" class="item">
        <img alt="stuff" src=${reader.result}>
      </a>
    `
    gallerySection.innerHTML = newItem + gallerySection.innerHTML

  })
  })
}

const addImagesToGallery = async () => {
  const gallerySection = document.querySelector('.gallery')
  const galleryData = await getEntryFromDb('gallery')
  const galleryItems = galleryData.reverse().map(singlePhoto => {
    console.log({singlePhoto});
    return `
      <a href="#" class="item">
        <img alt="stuff" src=${singlePhoto}>
      </a>
    `
  })
  gallerySection.style.display = 'grid'
  gallerySection.innerHTML = galleryItems.join('')
}

export { addGalleryEventListeners, addImagesToGallery }

