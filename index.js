import {
  initDatabase,
  addEntryToDb,
  getEntryFromDb,
  updateEntryToDb,
  checkEntryFromDb,
  deleteEntryFromDb,
  clearEntriesFromDb,
} from "./database.js";

const addTodo = (e) => {
  e.preventDefault();

  try {
    if (!todoInput.value.trim()) {
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
  const todoCheck = tagName === "INPUT" ? e.target : e.target.firstChild;
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

  try {
    if (!todoUpdate.firstChild.value) {
      throw new Error("할 일이 비어있습니다!");
    }

    const updateEntry = {
      todo: todoItemElem.firstChild.innerText,
    };

    const changes = {
      todo: todoUpdate.firstChild.value,
    };

    updateEntryToDb("todolist", updateEntry, changes).then(() =>
      showTodoList(e)
    );
  } catch (e) {
    console.log(e);
    alert("할 일을 입력해주세요!");
  }
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

// 투두 리스트 모든 목록 삭제
const clearTodo = (e) => {
  e.preventDefault();

  if (confirm("정말 다 삭제하시나요?") == true) {
    // 목록을 모두 지우므로 초기화 버튼을 투명으로 한다.
    clearTodoButton.style.visibility = "hidden";
    clearEntriesFromDb("todolist").then(() => showTodoList(e));
  }
};

// 중간 중간 이벤트리스너 처리를 위해 백틱으로 묶어 innerHTML 하는 형식이 아니라
// 태그 일일히 생성해서 넣는 형식을 취했습니다.
// 백틱으로 할 경우 'list_delete_btn' 태그에 이벤트 리스너 추가할 때
// 프로미스 관련 이유를 모르는 에러 발생으로 현재 형식으로 구현
const showTodoList = async (e) => {
  if (e) e.preventDefault();

  todoListCheck.innerHTML = "";

  const todoListComplete = [];

  const showTodo = (entry) => {
    const todoItemElem = document.createElement("li");

    const checkboxElem = document.createElement("input");
    checkboxElem.setAttribute("type", "checkbox");
    if (entry.check) checkboxElem.setAttribute("checked", "true");

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

    if (entry.check) todoListComplete.unshift(todoItemElem);
    else todoListCheck.appendChild(todoItemElem);
  };

  const todoList = await getEntryFromDb("todolist");

  // 목록이 존재하고 초기화 버튼이 투명일 때 다시 보이게 한다.
  console.log(clearTodoButton.style.visibility);
  if (todoList.length > 0 && clearTodoButton.style.visibility === "hidden") {
    clearTodoButton.style.visibility = "visible";
  }

  todoList.forEach((entry) => showTodo(entry));

  todoListComplete.forEach((todoItemElem) => {
    todoListCheck.prepend(todoItemElem);
    todoItemElem.childNodes[0].style.textDecoration = "line-through";
  });
};

const todoListCheck = document.querySelector("#list_check");

const todoInput = document.querySelector("#todo");
const addTodoButton = document.querySelector("#todo_submit_btn");

const clearTodoButton = document.querySelector("#todo_clear_btn");

addTodoButton.addEventListener("click", addTodo);
clearTodoButton.addEventListener("click", clearTodo);

initDatabase().then(showTodoList);

/*ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ*/
import { inputName, editName, loadName, editNameEnter } from "./inputName.js";
loadName(); //이름불러오기
inputName.addEventListener("click", () => {
  inputName.value = "";
}); //클릭시 불러온 이름 지우기

inputName.addEventListener("focusout", editName);
inputName.addEventListener("keypress", editNameEnter);

/*-----------------------------------------------------------*/
import { addPictureEventListener, loadProfilePic } from "./inputPropicture.js";
addPictureEventListener();
loadProfilePic();

/*------------------- Night mode------------------*/
const modeButton = document.getElementById("mode_btn");
const allDiv = document.querySelectorAll("div");
const allSpan = document.querySelectorAll("span");
const header = document.querySelector("header");
const footer = document.querySelector("footer");
const profileArea = document.getElementById("profile_name");
const qIcon = document.querySelector(".qIcon");
// const focusChangeColor = document.querySelector(".focusChangeColor");
// const restChangeColor = document.querySelector(".restChangeColor");
// const todoTitle = document.querySelector(".title_text");

function modeClick() {
  allDiv.forEach((e) => e.classList.toggle("night"));
  allSpan.forEach((e) => e.classList.toggle("night"));
  header.classList.toggle("night");
  footer.classList.toggle("night");
  profileArea.classList.toggle("night");
  qIcon.classList.toggle("night");
  todoInput.classList.toggle("night");

  const changeBtn = modeButton.getElementsByClassName("icon");
  const mask = document.getElementsByClassName("mask");
  const moon = document.getElementsByClassName("moon")[0];

  if (changeBtn[0].style.display !== "none") {
    changeBtn[1].style.display = "block";
    changeBtn[0].style.display = "none";
    // 나이트모드타이머
    mask[0].style.display = "none";
    mask[1].style.display = "none";
    moon.style.display = "block";
  } else {
    changeBtn[1].style.display = "none";
    changeBtn[0].style.display = "block";
    // 나이트모드타이머
    mask[0].style.display = "flex";
    mask[1].style.display = "flex";
    moon.style.display = "none";
  }
}

modeButton.addEventListener("click", modeClick);
