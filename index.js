import { addEntryToDb, getEntryFromDb, deleteEntryFromDb } from "./database.js"

const addTodo = (e) => {
    e.preventDefault();
    // 'todolist' 스토리지에 입력으로 들어온 투두리스트 추가
    addEntryToDb('todolist', todoInput.value);
    // 추가한 스토리지 출력
    showTodoList(e);
    // 입력 태그 칸 비우기
    todoInput.value = null;
}

const deleteTodo = (e) => {
    e.preventDefault();
    // 'todoDelete'가 button 안의 i태그를 가리키기 때문에 span태그 찾기
    const todoDelete = e.target.parentNode.parentNode.firstChild;
    // 'deleteEntryFromDb'에 비동기 처리가 들어가 있어서
    // 이렇게 안하면 삭제된 리스트가 반영되지 않습니다.
    deleteEntryFromDb('todolist', todoDelete.innerText)
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
    todoList.forEach((todo) => {
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

        // const listNameElem = document.createElement("span");
        // listNameElem.classList.add("list_name");
        // listNameElem.innerHTML = todo;

        const checkboxElem = document.createElement("input");
        checkboxElem.setAttribute("type", "checkbox");
        checkboxElem.setAttribute("name", "checklist");
        // checkboxElem.addEventListener("click", completeTodo);
        // checkboxElem.innerText = '✔';

        // const checklistElem = document.createElement("label");
        // checklistElem.setAttribute("for", "chekclist");

        const editButtonElem = document.createElement("button");
        editButtonElem.classList.add("list_edit_btn");
        editButtonElem.innerHTML = `<i class="fa-solid fa-pencil"></i>`;
        //editButtonElem.addEventListener("click", updateTodo);

        const deleteButtonElem = document.createElement("button");
        deleteButtonElem.classList.add("list_delete_btn");
        deleteButtonElem.addEventListener("click", deleteTodo);
        deleteButtonElem.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;

        todoItemElem.innerHTML += `<span class="list_name">${todo}</span>`;
        todoItemElem.appendChild(checkboxElem);
        todoItemElem.innerHTML += `<label for="checklist"></label>`;
        todoItemElem.appendChild(editButtonElem);
        todoItemElem.appendChild(deleteButtonElem);

        todoListTag.appendChild(todoItemElem);
    })
}

const todoListTag = document.querySelector('#list_check')

const todoInput = document.querySelector('#todo')
const addTodoButton = document.querySelector('#todo_submit_btn')

addTodoButton.addEventListener("click", addTodo)

export { showTodoList };