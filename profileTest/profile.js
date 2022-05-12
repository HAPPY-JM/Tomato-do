import Nav from './modules/nav.js'
import Bio from './modules/bio.js'
import Report from './modules/report.js'
import addBioEventListeners from "./modules/BioEvent.js"
import { onRequest } from './ProfileDB.js'

// Bio부분이 Promise를 사용하기 때문에 비동기 처리 해줘야함.
const App = async () => {
    return `
         ${Nav()}
         <div class="container">
         ${await Bio()}
         ${Report()}
         </div>
    `
}
onRequest.onsuccess = async ()=>{
document.getElementById('root').innerHTML = await App()
addBioEventListeners()
}