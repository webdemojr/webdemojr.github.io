import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

export var player = {
  id: '',
  winStatus: false,
  lostStatus: false,
  streakNumber: 0,
  wordsArray: [],
  lastVisit: 0,
  todaysWord: "",
  progressDroply:0,
  level:1,
  winNumber:0
}

export function createPlayerID() {
  player.id = 'drply-' + uuidv4()
}

export function updateLastVisit(time) {
  player.lastVisit = time
  AddToLocalStorage()
}

export function updateTodaysWord(word) {
  player.todaysWord = word
  AddToLocalStorage()
}

export function updateWordsArray(wA) {
  player.wordsArray.push(wA)
  AddToLocalStorage()
}

export function updateWinStatus(status) {
  player.winStatus = status
  AddToLocalStorage()
}

export function updateLostStatus(status) {
  player.lostStatus = status
  AddToLocalStorage()
}

export function updateProgressDroply() {
  player.progressDroply += 5
  AddToLocalStorage()
}

export function resetProgressDroply() {
  player.progressDroply = 0
  AddToLocalStorage()
}

export function updateLevel() {
  player.level++
  AddToLocalStorage()
}

export function updateWinNumber() {
  player.winNumber++
  AddToLocalStorage()
}


export function AddToLocalStorage() {
  try {
    localStorage.setItem("DroplyPlayer", JSON.stringify(player));
  } catch (e) {
    if (e == QUOTA_EXCEEDED_ERR) {
      alert('Quota exceeded!');
    }
  }

}
