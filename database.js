// Dexie로 데이터베이스 생성
const db = new Dexie("tomato-do");

// 객체 저장소를 초기화(생성)하고 초기 데이터 삽입
const initDatabase = async () => {
    // 객체 저장소 생성 (스키마 설정)
    // ++ : 자동으로 증가하는 기본 키
    db.version(1).stores({
        todolist: "++id, todo, startTime, endTime, check",
        userInfo: "++id,userName"
    });
    
    // Dexie 생성시 new Dexie(databaseName, options?);
    // options 중 데이터베이스를 자동으로 열어주는 'autoOpen' 존재
    // 'autoOpen'의 default 값이 true이므로 따로 open하지 않음

    const dataCount = await db.todolist.count();

    // 객체 저장소의 데이터가 존재하는 경우
    if(dataCount > 0) {
        return Promise.resolve();
    }

    // 초기 데이터 삽입
    // 기본적으로 Dexie의 CRUD 함수들을 Promise로 제공
    return await db.todolist.bulkAdd([
        { todo: "복습하기", startTime: 0, endTime: 0, check: false },
        { todo: "넷플릭스 시청", startTime: 0, endTime: 0, check: false }
    ]);
}

// 이름이 'storeName'인 객체 저장소에 값이 'entry'인 객체를 저장
const addEntryToDb = async (storeName, entry) => {
    return await db[storeName].add(entry);
}

// 이름이 'storeName'인 객체 저장소에서 데이터를 가져옵니다.
// condition이 존재하는 경우 해당 condition의 데이터만 가져옵니다.
// 비동기 처리로 데이터를 가져옵니다. 
// 데이터를 가져오는 행위는 항상 비동기로 이루어집니다.
const getEntryFromDb = async (storeName, condition) => {
    return (condition) ? await db[storeName].get(condition) : await db[storeName].toArray();
}

// 이름이 'storeName'인 객체 저장소의 값이 'entry'인 객체의 'changes'부분을 갱신
const updateEntryToDb = async (storeName, entry, changes) => {
    const item = await getEntryFromDb(storeName, entry);
    await db[storeName].update(item.id, changes);
}

// 이름이 'storeName'인 객체 저장소에서 값이 'entry'인 객체를 체크
const checkEntryFromDb = async (storeName, entry) => {
    const item = await getEntryFromDb(storeName, entry);
    item.check = true;
    return await db[storeName].update(item.id, item);
}

// 이름이 'storeName'인 객체 저장소에서 값이 'entry'인 객체를 삭제
const deleteEntryFromDb = async (storeName, entry) => {
    const item = await getEntryFromDb(storeName, entry);
    return await db[storeName].delete(item.id);
}

export { 
    initDatabase,
    addEntryToDb,
    getEntryFromDb,
    updateEntryToDb,
    checkEntryFromDb,
    deleteEntryFromDb
}
/*ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ*/
//테스트용
const testDb = async (entry) => {
}
export { testDb };