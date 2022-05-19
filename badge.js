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
      if (res.length >= 1) {
        badgeList.innerHTML += `
                    <div class="badgeAppear">
                      <i class="fa-solid fa-seedling newBadge" style="color:#c6e194; margin-right: 8px;"></i>
                      <span class="badgeText" > 뽀모도로 타이머 첫 사용!</span>
                    </div>
                    `;
      }
      if (res.filter((x) => x.date == todayDate).length >= 3) {
        badgeList.innerHTML += `
                <div class="badgeAppear">
                <i class="material-icons newBadge" style="color:#88b14b;">grass</i>
                <span class="badgeText" > 3회 사용! 화이팅!</span>
                </div>
                `;
      }
      if (res.filter((x) => x.date == todayDate).length >= 5) {
        badgeList.innerHTML += `
                <div class="badgeAppear">
                <i class="material-icons newBadge" style="color: #ff7f7e;">local_florist</i>
                <span class="badgeText" > 5회 사용! 좀 쉬세요</span>
                </div>
                `;
      }
    }
  });

  // console.log(badgeDb.filter((x)=>x.date==todayDate).length)
};

export { showProfileModal, hideProfileModal, badgeload };
