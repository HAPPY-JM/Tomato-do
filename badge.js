import { addEntryToDb,getEntryFromDb, deleteEntryFromDb} from "./database.js"
const badgeContent = document.querySelector("#badgeContent");

const showProfileModal = async ()=> {   
    
    const badgeBox = document.querySelector("#badgeBox");
    badgeBox.addEventListener("click",()=>{
        badgeContent.style.display = "block"
        // console.log("뱃지 상자 열기");
    })
}

const hideProfileModal = ()=> {
    
    const closeBtn = document.querySelector("#closeBtn");
    closeBtn.addEventListener("click",()=>{
        badgeContent.style.display = "none"
        // console.log("뱃지 상자 닫기");
    })
    
    
}

const badgeload = async () => {
    const today = new Date();
    const todayDate = today.toLocaleDateString();
    const badgeList = document.querySelector("#badgeList");
    badgeList.innerHTML = "";
    const badgeDb = await getEntryFromDb("report").then(
        res => {
        if(res){
            if(res.length >=1){
               
                 badgeList.innerHTML += `
                    
                    <i class="fa-solid fa-seedling" style="display: block;margin-top:10px;position:relative">
                    <span style="font-size:30px"> (새싹) : 타이머 첫 사용</span>
                    </i>
                    
                    `
            }
            if((res.filter((x)=>x.date==todayDate).length) >=5){
                
                badgeList.innerHTML +=`
                <i class="fa-solid fa-sun" style="display: block;margin-top:10px;position:relative">
                <span style="font-size:30px"> (태양) : 오늘 5번 이상 사용</span>
                </i> 
                `
            }
        }
        });
    
    // console.log(badgeDb.filter((x)=>x.date==todayDate).length)
    
    console.log("badgeload() 작동")
}


export {showProfileModal,hideProfileModal,badgeload}