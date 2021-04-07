let db

//Create a new request for a "budget" database
const DBrequest = indexedDB.open("budget", 1)

DBrequest.onupgradeneeded = function(e) {
    const db = DBrequest.result
    db.createObjectStore("pending", { autoIncrement: true })
}

DBrequest.onsuccess = function(e) {
    
}

DBrequest.onerror = function(e) {
    console.log("Error")
}