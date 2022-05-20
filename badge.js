import { addEntryToDb, getEntryFromDb, deleteEntryFromDb } from "./database.js";
const badgeContent = document.querySelector("#badgeContent");

const showProfileModal = async () => {
  const badgeBox = document.querySelector("#badgeBox");
  badgeBox.addEventListener("click", () => {
    badgeContent.style.display = "block";
    // console.log("뱃지 상자 열기");
    badgeload();
  });
};

const hideProfileModal = () => {
  const closeBtn = document.querySelector("#closeBtn");
  closeBtn.addEventListener("click", () => {
    badgeContent.style.display = "none";
    // console.log("뱃지 상자 닫기");
  });
};

const badgeload = async () => {
  const today = new Date();
  const todayDate = today.toLocaleDateString();
  const badgeList = document.querySelector("#badgeList");
  badgeList.innerHTML = "";
  const badgeDb = await getEntryFromDb("report").then((res) => {
    if (res) {
      if (res.length<=0) {
        badgeList.innerHTML += `
                    <div class="badgeAppear">
                      <i class="fa-solid fa-circle-question" style="color:#dbe0d3; margin-right: 8px;"></i>
                      <span class="badgeText" > 1회 달성 시 잠금해제</span>
                    </div>
                    `;
      }
      if (res.length >= 1) {
        badgeList.innerHTML += `
                    <div class="badgeAppear">
                      <i class="fa-solid fa-seedling newBadge" style="color:#c6e194; margin-right: 8px;"></i>
                      <span class="badgeText" > 토마토두 첫 완주!❤️</span>
                    </div>
                    `;
      }
      if(res.filter((x) => x.date == todayDate).length < 3) {
        badgeList.innerHTML += `
                <div class="badgeAppear">
                <i class="fa-solid fa-circle-question" style="color:#dbe0d3; display:in-line"></i>
                <span class="badgeText" > 3회 달성 시 잠금해제</span>
                </div>
                `;
      }
      if (res.filter((x) => x.date == todayDate).length >= 3) {
        badgeList.innerHTML += `
                <div class="badgeAppear">
                <i class="material-icons newBadge" style="color:#88b14b;">grass</i>
                <span class="badgeText" > 3회 완주 성공! 화이팅🙌</span>
                </div>
                `;
      }
      if(res.filter((x) => x.date == todayDate).length<5){
        badgeList.innerHTML += `
                <div class="badgeAppear">
                <i class="fa-solid fa-circle-question" style="color: #dbe0d3;"></i>
                <span class="badgeText" > 5회 달성 시 잠금해제</span>
                </div>
                `;
      }
      if (res.filter((x) => x.date == todayDate).length >= 5) {
        badgeList.innerHTML += `
                <div class="badgeAppear">
                <i class="material-icons newBadge" style="color: #ff7f7e;">local_florist</i>
                <span class="badgeText" > 5회 완주 성공! 대단하세요👍</span>
                </div>
                `;
      }
    }
  });

  // console.log(badgeDb.filter((x)=>x.date==todayDate).length)
};

export { showProfileModal, hideProfileModal, badgeload };
