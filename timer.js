//클래스 요소들 불러올 때 querySelector로 가져오면 null 뜨길래 getEle~로 가져왔어요..
const timerStartBtn = document.getElementsByClassName("timerBox_startButton")[0];
const timerStopBtn = document.getElementsByClassName("timerBox_stopButton")[0];
const timerResetBtn = document.getElementsByClassName("timerBox_resetButton")[0];

const focusTime = document.getElementsByClassName("focus timer_clock")[0];
const restTime = document.getElementsByClassName("rest timer_clock")[0];
const timerBtnCollect = document.getElementsByClassName("timer_btn_collection")[0];

//console.log(focusTime.outerText); 

let count = 0; //반복 횟수를 지정하기 위한 변수 설정
let focusTimer = 1500; //설정 할 집중시간(25분으로 기본 설정)
let min = ""; //남은 시간 - 분
let sec = ""; //남은 시간 - 초
let intervalTimer; //stop, reset 타이머 함수에서도 사용하기 위해 함수 밖에 변수 정의

function stopTimer() {
    clearInterval(intervalTimer); //타이머 중단
    //중단하면 재시작할 수 있는 start버튼과 초기화 하는 reset버튼이 나오도록 구현
    timerStopBtn.style.display = "none";
    timerResetBtn.style.display = "block";
    timerStartBtn.style.display = "block";
}

function resetTimer() {
    clearInterval(intervalTimer); //타이머 중단
    //중단 시 설정했던 시간으로 돌아가도록 함(일단 25분으로 설정, 추후 변수 이용하여 입력값을 대입하도록 수정)
    focusTime.innerHTML = `25:00`
    focusTimer = 1500;

    //버튼 다시 start버튼만 나오도록 구성
    timerStopBtn.style.display = "none";
    timerResetBtn.style.display = "none";
    timerStartBtn.style.display = "block";
}

function startTimer() {
    //타이머 시작하면서 start버튼은 사라지고 stop, reset버튼 나오도록 구현
    timerStopBtn.style.display = "block";
    timerResetBtn.style.display = "block";
    timerStartBtn.style.display = "none";

    //setInterval함수를 이용하여 설정한 시간을 기준으로 타이머 작동(일단 25분으로 고정하여 설정해둠)
    intervalTimer = setInterval(() => {
    --focusTimer; //타이머 작동

    min = parseInt(focusTimer/60); //분 표시
    sec = focusTimer%60 //초 표시

    //padStart를 이용하여 10분과 10초 미만으로 내려갔을 때 두자리 수로 만들어줌
    focusTime.innerHTML = `${String(min).padStart(2,"0")}:${String(sec).padStart(2,"0")} `;
    
        //만약 집중 시간이 종료되면 다시 25:00으로 설정되도록 함
        if(focusTimer < 0) {
            count = 1; //집중 횟수 1회 증가
            clearInterval(intervalTimer);
            focusTime.innerHTML = `25:00`
        }
    },1000)
}

timerStartBtn.addEventListener("click", startTimer);
timerStopBtn.addEventListener("click", stopTimer);
timerResetBtn.addEventListener("click", resetTimer);

