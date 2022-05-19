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
const moon = document.querySelector('.moon') //나이트모드타이머

const imgsiz = masking.clientHeight;

//console.log(focusTime.outerText);

let count = 0; //반복 횟수를 지정하기 위한 변수 설정
let focusTimer = 5; //설정 할 집중시간(25분으로 기본 설정)
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
    snd = new Audio("./snd/sndFC5.mp3"); // 25분에 맞는 알람사운드 설정
    timerTimeSet(); // 전역변수를 변경했으니 timer를 세팅
  } else {
    selectOption = "option50";
    snd = new Audio("./snd/sndMA0.mp3"); // 50분에 맞는 알람사운드 설정
    timerTimeSet();
  }
}

//옵션에 따른 timer 초기 셋
function timerTimeSet() {
  if (selectOption === "option25") {
    focusTime.innerHTML = `25:00`;
    restTime.innerHTML = `05:00`;
    focusTimer = 5;
    restTimer = 300;
  } else if (selectOption === "option50") {
    focusTime.innerHTML = `50:00`;
    restTime.innerHTML = `10:00`;
    focusTimer = 5;
    restTimer = 600;
  }
  focusTimerStart = focusTimer; //타이머 애니메이션 : 타이머 시작시 설정된 전체시간 기록
}

function stopTimer() {
  clearInterval(focusInterval); //타이머 중단
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
  moon.style.setProperty("opacity", `100%`); //나이트모드타이머
  //타이머 애니메이션 끝
}

function focusStart() {
  //타이머 시작하면서 start버튼은 사라지고 stop, reset버튼 나오도록 구현
  timerStopBtn.style.display = "block";
  timerResetBtn.style.display = "block";
  timerStartBtn.style.display = "none";

  focusTimerStart === focusTimer ? fadeInFunc() : null; //타이머 애니메이션: fadeIn 애니메이션 실행
  focusTimerStart === focusTimer ? moonFadeInFunc() : null;  //나이트모드타이머

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
      sndPlay(); //종료알람재생
      clearInterval(focusInterval);
      restStart();
    }
  }, 1000);
}

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
 //나이트모드타이머ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ시작
function moonFadeInFunc() {  
  let fadeInOercity = 100;
  let moonFadeIn = setInterval(() => {
    moon.style.setProperty("opacity", `${--fadeInOercity}%`);    
    if (fadeInOercity == 20) {
      clearInterval(moonFadeIn);
    }
  }, 10);
}
//나이트모드타이머ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ끝
// 타이머 애니메이션: 함수
function tomatoAnimation() {
  maskPositionY = (focusTimer * imgsiz) / focusTimerStart; //이미지 가릴부분 계산
  moonOpercity = 120 - Math.floor(focusTimer*100/focusTimerStart) //처음에 너무 어두우니까 이상해서 100>120으로 바꿈  //나이트모드타이머
  masking.style.setProperty("-webkit-mask-position-y", `${maskPositionY}px`); //웹킷

  // masking.style.setProperty('mask-position',`0 ${ parseInt(maskPositionY) }px`)  //css  
  moon.style.setProperty("opacity", `${moonOpercity}%`);  //나이트모드타이머

}

timerStartBtn.addEventListener("click", focusStart);
timerStopBtn.addEventListener("click", stopTimer);
timerResetBtn.addEventListener("click", resetTimer);

startOption25.addEventListener("click", select);
startOption50.addEventListener("click", select);


//알람사운드 작성중ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
//알람 사운드는 옵션선택에서 고름
const sndCheck = document.querySelector('#snd_check');
const sndtext = document.querySelector('#snd_text');
const timerSnd= document.querySelector('.timer_snd'); // 디바이스 체크후 div보여주기
// const checkDevice = navigator.userAgent
// const showSndDiv = ()=>{
  // const reg = /CriOS|ios|iPnone|iPad/;
  // alert(`>>>> ${reg.test(checkDevice)}<<<< - ${checkDevice}`)
  // return !reg.test(checkDevice)
// }
// console.log(showSndDiv())
// alert(showSndDiv());
// showSndDiv() ? timerSnd.style.display = "inline-block" : timerSnd.style.display = "none"; 

let snd = new Audio("./snd/sndFC5.mp3");

const sndPlay = () => { 
  // sndCheck.checked ? snd.play() : null;  
  snd.play()
    }
sndCheck.addEventListener('change',(e)=>{
  e.target.checked ? sndtext.innerText = "알람 ON" : sndtext.innerText = "알람OFF"
})

// console.log(checkDevice);
// alert(navigator.userAgent)
//아이폰 아이패드는 시간셋을 고른후 시작하면 적용되었음 처음부터 한번 고르게 하면 될것같음.
//알람사운드 작성중ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ끝