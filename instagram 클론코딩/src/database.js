// let database
const initializeDb = indexedDB.open('instagram', 2)

// initializeDb.onsuccess = () => {
//   database = initializeDb.result
//   console.log('Success creating or accessing db')
// }

initializeDb.onupgradeneeded = () => {
  const database = initializeDb.result
  database.createObjectStore('bio', {autoIncrement: true})
  database.createObjectStore('gallery', {autoIncrement: true})
}

// initializeDb.onerror = () => {
//   alert('Db 생성 오류')
// }

const addEntryToDb = (storeName, entry) => {
  const database = initializeDb.result
  const transaction = database.transaction([storeName], 'readwrite')
  const store = transaction.objectStore(storeName)
  store.add(entry)

  // transaction.oncomplete = () => alert(`Entry added to ${storeName}!`)
  transaction.onerror = () => {
    console.log(`error adding Entry to ${storeName}.`)
    console.log(transaction.error);
  }
}

const getEntryFromDb = (storeName, id) => {
  const data = new Promise((resolve, reject) => {
    const database = initializeDb.result
    const transaction = database.transaction([storeName])
    const store = transaction.objectStore(storeName)
    const request = id ? store.get(id) : store.getAll()
    request.onerror = () => {
      reject(request.error)
      console.log('error getting data from the store');
    }

    request.onsuccess = () => {
      resolve(request.result)
    }
  })

  return Promise.resolve(data)
}

const clearAllEntries = (storeName) => {
  const database = initializeDb.result
  const transaction = database.transaction([storeName], 'readwrite')
  const store = transaction.objectStore(storeName)
  store.clear()
}

export { initializeDb, addEntryToDb, getEntryFromDb, clearAllEntries }
