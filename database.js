import { showTodoList } from "./index.js"

// 'tomato-do'라는 데이터베이스 생성
// 안에 여러 Object Store(객체 저장소) 존재 가능
const onRequest = indexedDB.open('tomato-do', 1)

// 데이터베이스 생성후 모든 요청이 성공적일 경우
// (onupgradeneeded 후에)
onRequest.onsuccess = async () => {
    // 
    const initialData = await getEntryFromDb("todolist")
    // 'initialData'는 배열인데, 길이가 0이라면 초기 데이터가 없다는 의미이며, 0이 아니면 있는 경우
    const isInitialData = initialData.length === 0 ? false : true

    if (!isInitialData) {
        // 초기 데이터 삽입
        addEntryToDb('todolist', '복습하기')
        addEntryToDb('todolist', '넷플릭스 보기')
    }

    showTodoList();
}

// 1. 기존의 저장된 데이터베이스보다 큰 버전 번호의 데이터베이스가 로드 될 때
// 2. 데이터베이스를 처음 만들어서 첫 객체 저장소를 생성할 때
onRequest.onupgradeneeded = () => {
    const database = onRequest.result
    // 'todolist'라는 이름의 겍체 저장소를 생성
    database.createObjectStore('todolist', {autoIncrement: true})
}

// 에러 처리
onRequest.onerror = () => {
    alert('Error creating or accessing db')
}

// 이름이 'storeName'인 객체 저장소에서 값이 'entry'인 객체를 찾아 프로미스로 키를 반환합니다.
// indexedDB의 데이터 접근이 비동기밖에 안되서 새 Promise를 생성하는 식으로 해야 합니다.
const getKeyFromDb = (storeName, entry) => {

    const data = new Promise((resolve, reject) => {
        // 현재 데이터베이스를 가져옵니다.
        const database = onRequest.result
        // 트랜잭션 : 데이터베이스에서 객체를 지정
        // 트랜잭션 이루 객체 저장소에 접근 권한이 주어집니다.
        // 기본이 'readonly'이기때문에 생략가능
        const transaction = database.transaction([storeName])
        // 접근권한 주어졌으므로 원하는 객체 저장소를 불러옵니다.
        const store = transaction.objectStore(storeName)
    
        // 객체 저장소에서 객체를 살펴가며 값이 'entry'인 객체를 탐색
        // 'openCursor()' 자체가 비동기 통신이라 성공 실패 여부를 따지는 것으로 추정
        const request = store.openCursor()
        request.onerror = () => {
            console.log('error getting data from the store')
            reject(request.error)
        }
    
        request.onsuccess = () => {
            let cursor = request.result;
            // console.log(cursor);
            if(cursor) {
                if(cursor.value === entry) {
                    resolve(cursor.key);
                } else cursor.continue();
            }
        }
    })
  
    return Promise.resolve(data)
}

// 이름이 'storeName'인 객체 저장소에 값이 'entry'인 객체를 저장
const addEntryToDb = (storeName, entry) => {
    const database = onRequest.result;
    // 새로운 객체를 추가할 것이기 때문에 'readwrite' 모드로 접근권한을 요청
    const transaction = database.transaction([storeName], "readwrite");
    const store = transaction.objectStore(storeName);
    // 객체 저장소에 객체는 (키, 객체) 형식으로 저장되며
    // 키를 설정하지 않은 경우 자동적으로 1부터 붙여집니다.
    store.add(entry);
}

// 이름이 'storeName'인 객체 저장소에서 데이터를 가져옵니다.
// id가 존재하는 경우 해당 id의 데이터만 가져옵니다.
const getEntryFromDb = (storeName, id) => {
    // 비동기 처리로 데이터를 가져옵니다. 
    // 데이터를 가져오는 행위는 항상 비동기로 이루어집니다.
    const data = new Promise((resolve, reject) => {
        const database = onRequest.result
        const transaction = database.transaction([storeName])
        const store = transaction.objectStore(storeName)
        
        const request = id ? store.get(id) : store.getAll()
        request.onerror = () => {
            reject(request.error)
            console.log('error getting data from the store')
        }

        request.onsuccess = () => {
            resolve(request.result)
        }
    })
  
    return Promise.resolve(data)
}

// 이름이 'storeName'인 객체 저장소에서 값이 'entry'인 객체를 삭제
// 현재 삭제하는 식으로 구현되어 있지만 나중에 시간 데이터 등을 쓰기위해서
// 완료된 투두리스트를 check 표시를 해서 'getEntryFromDb'에서 안 읽던가
// 다른 객체 저장소를 생성해 객체 위치를 옮길 예정
const deleteEntryFromDb = async (storeName, entry) => {
    const id = await getKeyFromDb(storeName, entry);

    const database = onRequest.result;
    const transaction = database.transaction([storeName], "readwrite");
    const store = transaction.objectStore(storeName);
    
    const request = store.delete(id);
    // 'index.js' 의 'deleteTodo' 에서 'showTodoList'을 사용하기 위해 promise로 반환
    return new Promise((resolve, reject) => {
        request.onerror = () => {
            reject(request.error)
            console.log('error getting data from the store')
        }
    
        request.onsuccess = () => {
            resolve(request.result)
        }
    });
}

export { addEntryToDb, getEntryFromDb, deleteEntryFromDb }