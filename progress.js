const STORE_KEY="cantoForeverProgress";
function loadState(){try{return JSON.parse(localStorage.getItem(STORE_KEY))||{completed:[],notes:{},answers:{},recordings:[],streak:0,lastDate:null};}catch{return {completed:[],notes:{},answers:{},recordings:[],streak:0,lastDate:null};}}
let STATE=loadState();
function saveState(){localStorage.setItem(STORE_KEY,JSON.stringify(STATE));}
function completeClass(id){if(!STATE.completed.includes(id)){STATE.completed.push(id);STATE.completed.sort((a,b)=>a-b);updateStreak();saveState();}}
function updateStreak(){const today=new Date().toISOString().slice(0,10);if(STATE.lastDate!==today){STATE.streak++;STATE.lastDate=today;}}
function isComplete(id){return STATE.completed.includes(id)}
function pct(){return Math.round(STATE.completed.length/60*100)}