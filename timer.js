const timerStartBtn = document.getElementsByClassName("timerBox_startButton")[0];
const timerStopBtn = document.getElementsByClassName("timerBox_stopButton")[0];
const timerResetBtn = document.getElementsByClassName("timerBox_resetButton")[0];

const focusTime = document.getElementsByClassName("focus timer_clock")[0];
const restTime = document.getElementsByClassName("rest timer_clock")[0];
const timerBtnCollect = document.getElementsByClassName("timer_btn_collection")[0];

console.log(focusTime.outerText);

let focusTimer = 1500; //설정 할 집중시간(25분으로 기본 설정)
let min = ""; //남은 시간 - 분
let sec = ""; //남은 시간 - 초
let intervalTimer;

function stopTimer() {
    clearInterval(intervalTimer);
}

function resetTimer() {
    console.log("Reset")
}

function startTimer(e) {
    //start버튼을 stop버튼으로 변경
    //timerStartBtn.innerText = "Stop";
    timerBtnCollect.innerHTML = `
<button class="timerBox_stopButton" onclick="stopTimer()">Stop</button>    
<button class="timerBox_resetButton" onclick="resetTimer()">Reset</button>`;

    //setInterval함수를 이용하여 설정한 시간을 기준으로 타이머 작동(일단 25분으로 고정하여 설정해둠)
    let intervalTimer = setInterval(() => {
        --focusTimer; //타이머 작동

        min = parseInt(focusTimer/60); //분 표시
        sec = focusTimer%60 //초 표시

        //padStart를 이용하여 10분과 10초 미만으로 내려갔을 때 두자리 수로 만들어줌
        focusTime.innerHTML = `${String(min).padStart(2,"0")}:${String(sec).padStart(2,"0")} `;
        
        //만약 집중 시간이 종료되면 다시 25:00으로 설정되도록 함
        if(focusTimer < 0) {
            clearInterval(intervalTimer);
            focusTime.innerHTML = `${focusTimer/60} : ${focusTimer%60}`
        }
    },1000)
}

timerStartBtn.addEventListener("click", startTimer);
