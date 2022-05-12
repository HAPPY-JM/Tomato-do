//tomato-do 데이터베이스를 염.
//이때 onRequest라는 변수에 데이터베이스를 담음.
// 05/12 일 12:50분 기준으로 데이터베이스 버전이 10이여서 11으로 함.
// 데이터베이스의 버전이 11보다 높다면 에러를 발생시켜서 onRequest.onerror가 작동함.
const onRequest = indexedDB.open("tomato-do", 11);


    // Name과 Version 모두 일치하는 데이터베이스가 있다면 호출
    // 메세지가 콘솔 로그에 찍힘.
    // onRequest가 tomato-doDB임
    onRequest.onsuccess = () => {
      const database = onRequest.result
       console.log('Success accessing db')
    }
//////
    // Name과 Version 모두 일치하는 데이터베이스가 없는 경우 호출
    // 이미 데이터베이스를 만들어 놔서
    // 데이터베이스에 report와 profile스토어를 생성해야 하기 때문에 위의 버전에서 11로 해줌.
    // 이미 report와 profile의 스토어가 있다면(버전이 11이라면) sucess가 작동함.
    onRequest.onupgradeneeded = () => {
        
        const database = onRequest.result
        database.createObjectStore('profile', {autoIncrement: true})
        database.createObjectStore('report', {autoIncrement: true});
    }

    // Name이 일치해도 존재하는 DB가 없거나 DB 호출에 실패했을 때 호출
    // Name과 version이 일치하지 않았을때와 비교하기 위해 다른 메세지를 콘솔에 찍음
    onRequest.onerror = () => {
      alert('Error accessing db')
    }

// 사용자가 입력한 데이터를 데이터베이스에 추가 
// (테스트를 위해서 임의로 함수 이름 맘대로 정한거라 사용시 이름 변경 필요함.)
// export할시 다른 이름으로 해준다든가 그러면 될듯..
// ex)사용예시 -> addentryDoDb("저장할 스토어 이름",저장할 내용(객체,문장,숫자 등의 형태))
  const addEntryToDb = (storeName, entry) => 
    {
    // database라는 변수에 DB의 결과 담음
    const database = onRequest.result

    // 데이터베이스에 입력하기 위해 transaction을 실행
    // storeName라는 스토어에서 일고 쓸 수 잇게 해준다는 말임
    const transaction = database.transaction([storeName], 'readwrite')

    // store에 값을 삽입하기 위해 objectStore() 함수로 테이블 선택 및 add() 함수로 원하는 객체를 추가
    // stroeName라는 스토어가 transaction에 담겨있는상태
        const store = transaction.objectStore(storeName)
        store.add(entry)

    // 성공하면 alert해줌
    transaction.oncomplete = () => alert(`Entry added to ${storeName}!`)
    // 실패하면 alert해줌
    transaction.onerror = () => alert(`Fail added to ${storeName}!`)
    }


//데이터베이스에 저장된 데이터를 화면에 렌더링할 함수(저장된 데이터 베이스 보내줌)
// id => key를 뜻함. 여기서는 인덱스랑 똑같다고 보면 됨 
  const getEntryFromDb = (storeName, id) => {
    const data = new Promise((resolve, reject) => {
      console.log("프로미스 확인")
      const database = onRequest.result
     
       //transaction 생성(addEntryToDb부분과 동일,readwrite는 읽기만 할거라 default값 사용)
      const transaction = database.transaction([storeName])
      const store = transaction.objectStore(storeName)
      //id가 유효하다면 store.get()을 사용해서 request에 가져온 데이터를 할당합니다.
      //유효하지 않다면 store.getAll()을 반환합니다.
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
  // 데이터베이스에 저장된 값을 삭제 할때
  const clearAllEntries = (storeName) => {
      // 3줄 위 함수들과 동일
    const database = onRequest.result
    const transaction = database.transaction([storeName], 'readwrite')
    const store = transaction.objectStore(storeName)
    // 스토어의 내용 없앰.
    store.clear()
    console.log('store.clear() 실행');
  } 


export { onRequest, addEntryToDb, getEntryFromDb, clearAllEntries }
