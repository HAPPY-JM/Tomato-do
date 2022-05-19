import {
  initDatabase,
  addEntryToDb,
  getEntryFromDb,
  updateEntryToDb,
  checkEntryFromDb,
  deleteEntryFromDb,
} from "./database.js";

const addTodo = (e) => {
  e.preventDefault();

  try {
    if (!todoInput.value) {
      throw new Error("할 일이 비어있습니다!");
    }
    // 'todolist' 스토리지에 입력으로 들어온 투두리스트 추가
    const inputEntry = {
      todo: todoInput.value,
    };
    addEntryToDb("todolist", inputEntry).then(() => showTodoList(e));
    // 입력 태그 칸 비우기
    todoInput.value = null;
  } catch (e) {
    console.log(e);
    alert("할 일을 입력해주세요!");
  }
};

const checkTodo = (e) => {
  e.preventDefault();
  const tagName = e.target.tagName;
  const todoCheck = (tagName === "INPUT") ? e.target : e.target.firstChild;
  const checkEntry = {
    todo: todoCheck.parentNode.innerText,
  };

  checkEntryFromDb("todolist", checkEntry).then(() => showTodoList(e));
};

const updateTodo = (e) => {
  e.preventDefault();

  // 수정할 내용을 받아줄 input 박스와 수정(완료) 버튼을 생성
  const tagName = e.target.tagName;
  const iTodoUpdate = e.target.parentNode.parentNode;
  const buttonTodoUpdate = e.target.parentNode;
  const todoUpdate = tagName === "I" ? iTodoUpdate : buttonTodoUpdate;
  const todoItemElem = document.createElement("li");
  todoItemElem.innerHTML = todoUpdate.innerHTML;

  const updateTodoElem = document.createElement("input");
  updateTodoElem.setAttribute("id", "todo_update_submit_btn");
  updateTodoElem.setAttribute("type", "submit");
  updateTodoElem.setAttribute("value", "수정");
  updateTodoElem.addEventListener("click", (e) =>
    updateTodoComplete(e, todoItemElem, todoUpdate)
  );

  todoUpdate.innerHTML = `<input id="todo_update" type="input" value="${todoUpdate.firstChild.innerText}">`;
  todoUpdate.appendChild(updateTodoElem);
};

// 수정(완료) 버튼을 누르면 실행되는 이벤트
// 기존 li태그의 복사본을 인자로 받아 span태그의 내용만 갱신
const updateTodoComplete = (e, todoItemElem, todoUpdate) => {
  e.preventDefault();

  const updateEntry = {
    todo: todoItemElem.firstChild.innerText,
  };

  const changes = {
    todo: todoUpdate.firstChild.value,
  };

  updateEntryToDb("todolist", updateEntry, changes).then(() => showTodoList(e));
};

const deleteTodo = (e) => {
  e.preventDefault();

  if (confirm("정말 삭제하시나요?") == true) {
    const tagName = e.target.tagName;
    const iTodoDelete = e.target.parentNode.parentNode.firstChild;
    const buttonTodoDelete = e.target.parentNode.firstChild;
    const todoDelete = tagName === "I" ? iTodoDelete : buttonTodoDelete;
    const deleteEntry = {
      todo: todoDelete.innerText,
    };
    // 'deleteEntryFromDb'에 비동기 처리가 들어가 있어서
    // 이렇게 안하면 삭제된 리스트가 반영되지 않습니다.
    deleteEntryFromDb("todolist", deleteEntry).then(() => showTodoList(e));
  }
};

// 중간 중간 이벤트리스너 처리를 위해 백틱으로 묶어 innerHTML 하는 형식이 아니라
// 태그 일일히 생성해서 넣는 형식을 취했습니다.
// 백틱으로 할 경우 'list_delete_btn' 태그에 이벤트 리스너 추가할 때
// 프로미스 관련 이유를 모르는 에러 발생으로 현재 형식으로 구현
const showTodoList = async (e) => {
  if (e) e.preventDefault();

  todoListActive.innerHTML = "";
  todoListComplete.innerHTML = "";

  const showTodo = (entry) => {
    const todoItemElem = document.createElement("li");

    const checkboxElem = document.createElement("input");
    checkboxElem.setAttribute("type", "checkbox");
    if (entry.check) checkboxElem.setAttribute("checked", "true");
    // checkboxElem.addEventListener("click", checkTodo);

    const checklistElem = document.createElement("label");
    checklistElem.classList.add("list_name");
    checklistElem.appendChild(checkboxElem);
    checklistElem.innerHTML += entry.todo;
    checklistElem.addEventListener("click", checkTodo);

    const editButtonElem = document.createElement("button");
    editButtonElem.classList.add("list_edit_btn");
    editButtonElem.innerHTML = `<i class="fa-solid fa-pencil"></i>`;
    editButtonElem.addEventListener("click", updateTodo);

    const deleteButtonElem = document.createElement("button");
    deleteButtonElem.classList.add("list_delete_btn");
    deleteButtonElem.addEventListener("click", deleteTodo);
    deleteButtonElem.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;

    todoItemElem.appendChild(checklistElem);
    todoItemElem.appendChild(editButtonElem);
    todoItemElem.appendChild(deleteButtonElem);

    if (entry.check) todoListComplete.appendChild(todoItemElem);
    else todoListActive.appendChild(todoItemElem);
  };

  const todoList = await getEntryFromDb("todolist");
  todoList.forEach((entry) => showTodo(entry));
};

const todoListActive = document.querySelector("#list_active");
const todoListComplete = document.querySelector("#list_complete");

const todoInput = document.querySelector("#todo");
const addTodoButton = document.querySelector("#todo_submit_btn");

addTodoButton.addEventListener("click", addTodo);

initDatabase().then(showTodoList);

/*ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ*/
import { inputName, editName, loadName } from "./inputName.js";
loadName(); //이름불러오기
inputName.addEventListener("click", () => {
  inputName.value = "";
}); //클릭시 불러온 이름 지우기
inputName.addEventListener("blur", loadName); //클릭후 이름 입력하지않고 포커스아웃되면 이름 불러오기
inputName.addEventListener("keypress", editName); //

/*-----------------------------------------------------------*/
import {addPictureEventListener,loadProfilePic} from "./inputPropicture.js";
addPictureEventListener();
loadProfilePic();

/*------------------- Night mode------------------*/
const modeButton = document.getElementById("mode_btn");
const allDiv = document.querySelectorAll("div");
const allSpan = document.querySelectorAll("span");
const header = document.querySelector("header");
const footer = document.querySelector("footer");
const profileArea = document.getElementById("profile_name");

function modeClick() {
  allDiv.forEach((e) => e.classList.toggle("night"));
  allSpan.forEach((e) => e.classList.toggle("night"));
  header.classList.toggle("night");
  footer.classList.toggle("night");
  profileArea.classList.toggle("night");

  const changeBtn = modeButton.getElementsByClassName("icon");
  console.log(changeBtn);
  if (changeBtn[0].style.display !== "none") {
    changeBtn[1].style.display = "block";
    changeBtn[0].style.display = "none";
  } else {
    changeBtn[1].style.display = "none";
    changeBtn[0].style.display = "block";
  }
}

modeButton.addEventListener("click", modeClick);

import {showProfileModal,hideProfileModal} from "./badge.js"
showProfileModal();
hideProfileModal();
// setInterval(badgeload(),1000);



// 타이머 기록 데이터베이스로 보내기 위한 import
import {focusStart,addTestBtnEventListener} from "./badgeTimer.js"
const button = document.getElementsByClassName("focus timer_clock")[0];
button.addEventListener("click",focusStart);
// 밑의 부분은 타이머 버튼 작동위한 코드임. index,js 부분과 index.html부분, badgeTimer.js 주석 함께 지워야함.
// addTestBtnEventListener();
