import { 
    initDatabase,
    addEntryToDb,
    getEntryFromDb,
    updateEntryToDb,
    checkEntryFromDb,
    deleteEntryFromDb
} from "./database.js"

const addTodo = (e) => {
    e.preventDefault();
    // 'todolist' 스토리지에 입력으로 들어온 투두리스트 추가
    const inputEntry = {
        todo: todoInput.value,
        startTime: 0,
        endTime: 0
    };
    addEntryToDb('todolist', inputEntry)
        .then(() => showTodoList(e));
    // 입력 태그 칸 비우기
    todoInput.value = null;
}

const completeTodo = (e) => {
    e.preventDefault();
}

const updateTodo = (e) => {
    e.preventDefault();

    // 수정할 내용을 받아줄 input 박스와 수정(완료) 버튼을 생성
    const todoUpdate = e.target.parentNode.parentNode;
    const todoItemElem = document.createElement("li");
    todoItemElem.innerHTML = todoUpdate.innerHTML;

    const updateTodoElem = document.createElement("input");
    updateTodoElem.setAttribute("id", "todo_update_submit_btn");
    updateTodoElem.setAttribute("type", "submit");
    updateTodoElem.setAttribute("value", "수정");
    updateTodoElem.addEventListener("click", (e) => updateTodoComplete(e, todoItemElem));

    todoUpdate.innerHTML = `<input id="todo_update" type="input" value="${todoUpdate.firstChild.innerText}">`;
    todoUpdate.appendChild(updateTodoElem);
}

// 수정(완료) 버튼을 누르면 실행되는 이벤트
// 기존 li태그의 복사본을 인자로 받아 span태그의 내용만 갱신
const updateTodoComplete = (e, todoItemElem) => {
    e.preventDefault();

    const todoUpdate = e.target.parentNode.firstChild;

    const updateEntry = {
        todo: todoItemElem.firstChild.innerText
    }

    const changes = {
        todo: todoUpdate.value
    }

    updateEntryToDb('todolist', updateEntry, changes)
        .then(() => showTodoList(e));
}

const deleteTodo = (e) => {
    e.preventDefault();
    // 'todoDelete'가 button 안의 i태그를 가리키기 때문에 span태그 찾기
    const todoDelete = e.target.parentNode.parentNode.firstChild;
    // 'deleteEntryFromDb'에 비동기 처리가 들어가 있어서
    // 이렇게 안하면 삭제된 리스트가 반영되지 않습니다.
    const deleteEntry = {
        todo: todoDelete.innerText
    };
    deleteEntryFromDb('todolist', deleteEntry)
        .then(() => showTodoList(e));
}

// 중간 중간 이벤트리스너 처리를 위해 백틱으로 묶어 innerHTML 하는 형식이 아니라
// 태그 일일히 생성해서 넣는 형식을 취했습니다.
// 백틱으로 할 경우 'list_delete_btn' 태그에 이벤트 리스너 추가할 때
// 프로미스 관련 이유를 모르는 에러 발생으로 현재 형식으로 구현
const showTodoList = async (e) => {
    if(e) e.preventDefault()

    todoListTag.innerHTML = ""

    const todoList = await getEntryFromDb('todolist')
    todoList.forEach((entry) => {
        // 백틱으로 할 경우
        // todoListTag.innerHTML += `
        // <li>
        //     <span class="list_name">${todo}</span>
        //     <input type="checkbox" name="checklist">
        //     <label for="checklist"></label>
        //     <button class="list_edit_btn"><i class="fa-solid fa-pencil"></i></button>
        //     <button class="list_delete_btn"><i class="fa-solid fa-trash-can"></i></button>
        // </li>`
        const todoItemElem = document.createElement("li");

        const checkboxElem = document.createElement("input");
        checkboxElem.setAttribute("type", "checkbox");
        // label의 for과 연결시키기 위해 "name"에서 "id"로 변경
        checkboxElem.setAttribute("id", "checklist");
        checkboxElem.addEventListener("change", completeTodo);
        // checkboxElem.innerText = '✔';

        const checklistElem = document.createElement("label");
        checklistElem.setAttribute("for", "checklist");

        const editButtonElem = document.createElement("button");
        editButtonElem.classList.add("list_edit_btn");
        editButtonElem.innerHTML = `<i class="fa-solid fa-pencil"></i>`;
        editButtonElem.addEventListener("click", updateTodo);

        const deleteButtonElem = document.createElement("button");
        deleteButtonElem.classList.add("list_delete_btn");
        deleteButtonElem.addEventListener("click", deleteTodo);
        deleteButtonElem.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;

        todoItemElem.innerHTML += `<span class="list_name">${entry.todo}</span>`;
        todoItemElem.appendChild(checkboxElem);
        todoItemElem.appendChild(checklistElem);
        todoItemElem.appendChild(editButtonElem);
        todoItemElem.appendChild(deleteButtonElem);

        todoListTag.appendChild(todoItemElem);
    })
}

const todoListTag = document.querySelector('#list_check')

const todoInput = document.querySelector('#todo')
const addTodoButton = document.querySelector('#todo_submit_btn')

addTodoButton.addEventListener("click", addTodo)

initDatabase().then(showTodoList);

/*ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ*/
import { inputName, editName, loadName } from "./inputName.js";
loadName(); //이름불러오기
inputName.addEventListener('click',()=>{inputName.value = "";}); //클릭시 불러온 이름 지우기
inputName.addEventListener('blur',loadName); //클릭후 이름 입력하지않고 포커스아웃되면 이름 불러오기
inputName.addEventListener('keypress',editName); //