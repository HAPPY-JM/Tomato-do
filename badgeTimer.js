//클래스 요소들 불러올 때 querySelector로 가져오면 null 뜨길래 getEle~로 가져왔어요..
const timerStartBtn = document.getElementsByClassName(
  "timerBox_startButton"
)[0];
const timerStopBtn = document.getElementsByClassName("timerBox_stopButton")[0];
const timerResetBtn = document.getElementsByClassName(
  "timerBox_resetButton"
)[0];

const focusTime = document.getElementsByClassName("focus timer_clock")[0];
const restTime = document.getElementsByClassName("rest timer_clock")[0];
const timerBtnCollect = document.getElementsByClassName(
  "timer_btn_collection"
)[0];

const startOption25 = document.getElementsByClassName("start_option1")[0];
const startOption50 = document.getElementsByClassName("start_option2")[0];

const masking = document.querySelector('.masking')
const imgsiz = masking.clientHeight;

//console.log(focusTime.outerText);

let count = 0; //반복 횟수를 지정하기 위한 변수 설정
let focusTimer = 1500; //설정 할 집중시간(25분으로 기본 설정)
let restTimer = 300;
let min = ""; //남은 시간 - 분
let sec = ""; //남은 시간 - 초
let focusInterval; //stop, reset 타이머 함수에서도 사용하기 위해 함수 밖에 변수 정의
let restInterval;

let selectOption = "option25"; // 현재 옵션 상태 체크를 위한 전역변수 설정
// 초기 값 25분이니 option25로 설정 시작
// 더하여 위 focusTImer, restTimer 값이 없을 시 완전 초기에 저장된 시간이 없어 NaN 오류 발생함
// 따라서 selectOption과 더불어 focusTimer, restTimer 도 1500, 300으로 초기 설정
let focusTimerStart = focusTimer; 
// 타이머 애니메이션 시간계산에 사용됩니다.

function select(e) {
    resetTimer();
  // btn 클릭 시 select 함수로 eventlisten하여 해당 버튼 value에 따라 전역변수 selectOption의 값 변경
  const userPick = e.target.value;
  if (userPick === startOption25.value) {
    selectOption = "option25";
    timerTimeSet(); // 전역변수를 변경했으니 timer를 세팅
  } else {
    selectOption = "option50";
    timerTimeSet();
  }
}



//옵션에 따른 timer 초기 셋
function timerTimeSet() {
  if (selectOption === "option25") {
    focusTime.innerHTML = `25:00`;
    restTime.innerHTML = `05:00`;
    // focusTimer = 1500; test해본다고 시작시간 바꿈!!!!!!!!!!!!!!!!!!!!!!!!!! 1500으로 복구하고 올리기
    focusTimer = 1500;
    restTimer = 300;
  } else if (selectOption === "option50") {
    focusTime.innerHTML = `50:00`;
    restTime.innerHTML = `10:00`;
    focusTimer = 3000;
    restTimer = 600;
  }
  focusTimerStart = focusTimer; //타이머 애니메이션 : 타이머 시작시 설정된 전체시간 기록
}

function stopTimer() {
  clearInterval(focusInterval); //타이머 중단
 
  console.log("stopTimer 작동시 focusInterval : "+focusInterval);
  //중단하면 재시작할 수 있는 start버튼과 초기화 하는 reset버튼이 나오도록 구현
  timerStopBtn.style.display = "none";
  timerResetBtn.style.display = "block";
  timerStartBtn.style.display = "block";
}

function resetTimer() {
  clearInterval(focusInterval); //타이머 중단
  //중단 시 설정했던 시간으로 돌아가도록 함(일단 25분으로 설정, 추후 변수 이용하여 입력값을 대입하도록 수정)
  
  timerTimeSet(); // 처음 시간으로 돌리는 건 timeset과 같으니 그대로 불러옴.
  // 전역변수 selectOption이 변경되지 않았으므로 바꾼 옵션대로 reset 될 것임.

  //버튼 다시 start버튼만 나오도록 구성
  timerStopBtn.style.display = "none";
  timerResetBtn.style.display = "none";
  timerStartBtn.style.display = "block";

  //타이머 애니메이션: 리셋버튼클릭시 빨간토마토로 돌아갑니다.
  masking.style.setProperty("-webkit-mask-position-y", `0px`); //webkit
  // masking.style.setProperty('mask-position',`0 0px`)  //css
  //타이머 애니메이션 끝
  
}

// 타이머 기록 보내기위한 함수들 import
import { addEntryToDb} from "./database.js"
import {badgeload} from "./badge.js"

function focusStart() {
  //타이머 시작하면서 start버튼은 사라지고 stop, reset버튼 나오도록 구현
  timerStopBtn.style.display = "block";
  timerResetBtn.style.display = "block";
  timerStartBtn.style.display = "none";  
  
  focusTimerStart === focusTimer ? fadeInFunc() : null; //타이머 애니메이션: fadeIn 애니메이션 실행

  //------------------------타이머 db위한 변수 생성 시작----------------------//
  const today = new Date();
  const timerstart = today.toLocaleTimeString();
  // console.log(timerstart)
  //------------------------타이머 db위한 변수 생성 끝----------------------//


  //setInterval함수를 이용하여 설정한 시간을 기준으로 타이머 작동(일단 25분으로 고정하여 설정해둠)
  focusInterval = setInterval(() => {
    --focusTimer; //타이머 작동
  
    tomatoAnimation(); //타이머 애니메이션: 실행    

    min = parseInt(focusTimer / 60); //분 표시
    sec = focusTimer % 60; //초 표시

    //padStart를 이용하여 10분과 10초 미만으로 내려갔을 때 두자리 수로 만들어줌
    focusTime.innerHTML = `${String(min).padStart(2, "0")}:${String(
      sec
    ).padStart(2, "0")} `;

    //만약 집중 시간이 종료되면 다시 25:00으로 설정되도록 함
    if (focusTimer <= 0) {
      clearInterval(focusInterval);
      restStart();
      
      //---------------타이머 기록 데이터베이스로 보내기 시작------------------------------------------------------//
      const todayDate =today.toLocaleDateString()
      const timerEndDb = today.toLocaleTimeString()
      // alert(`today = ${today}`)
      addEntryToDb("report",{date : todayDate, startTime:timerstart, endTime:timerEndDb})
      badgeload();
      console.log("타이머 시간 됨")
      //---------------타이머 기록 데이터베이스로 보내기 끝------------------------------------------------------//
    }
  }, 1000);
      
}

// 밑의 부분은 타이머 버튼 작동위한 코드임. index,js 부분과 index.html부분, badgeTimer.js 주석 함께 지워야함.
 function addTestBtnEventListener(){
  const DbtestBtn = document.querySelector("#DbtestBtn");
  const testtoday = new Date();
  DbtestBtn.addEventListener("click",()=>{
     addEntryToDb("report",{date : testtoday.toLocaleDateString(), startTime:testtoday.toLocaleTimeString(), endTime:testtoday.toLocaleTimeString()});
     badgeload();
  })
  
  
}
// 밑의 부분은 타이머 버튼 작동위한 코드임. index,js 부분과 index.html부분, badgeTimer.js 주석 함께 지워야함.
// export {focusStart,addTestBtnEventListener}
export {focusStart,addTestBtnEventListener}
function restStart() {
  restInterval = setInterval(() => {
    --restTimer;

    min = parseInt(restTimer / 60); //분 표시
    sec = restTimer % 60; //초 표시

    restTime.innerHTML = `${String(min).padStart(2, "0")}:${String(
      sec
    ).padStart(2, "0")} `;

    if (restTimer < 0) {
      clearInterval(restInterval);
      resetTimer();
      count += 1; // 1사이클 증가
    }
  }, 1000);
}

//타이머 애니메이션: 포커스타이머 시작시 초록색에서 빨간색으로 자연스럽게 바뀌는 애니메이션 함수
function fadeInFunc() {  
  let fadeInOercity = 100;
  let tomatoFadeIn = setInterval(() => {
    masking.style.setProperty("opacity", `${--fadeInOercity}%`);
    if (fadeInOercity < 0) {
      clearInterval(tomatoFadeIn);
      masking.style.setProperty("opacity", "100");
    }
  }, 10);
}

// 타이머 애니메이션: 함수
function tomatoAnimation() {  
  maskPositionY = (focusTimer * imgsiz) / focusTimerStart; //이미지 가릴부분 계산
  masking.style.setProperty("-webkit-mask-position-y", `${maskPositionY}px`); //웹킷
  // masking.style.setProperty('mask-position',`0 ${ parseInt(maskPositionY) }px`)  //css  
}

timerStartBtn.addEventListener("click", focusStart);
timerStopBtn.addEventListener("click", stopTimer);
timerResetBtn.addEventListener("click", resetTimer);

startOption25.addEventListener("click", select);
startOption50.addEventListener("click", select);

