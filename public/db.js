// const { get } = require("mongoose")
// const { response } = require("express")

let db

//Create a new request for a "budget" database
const DBrequest = indexedDB.open("budget", 1)

DBrequest.onupgradeneeded = function(e) {
    const db = e.target.result
    db.createObjectStore("pending", { autoIncrement: true })
}

DBrequest.onsuccess = function(e) {
    db = e.target.result

    //Check if app is online, before reading the DB
    if (navigator.onLine) {
       checkDB()
    }
}

DBrequest.onerror = function(e) {
    console.log(e.target.errorCode)
}

function saveRecord(record) {
    //Readwrite access transaction on pending db
    const transaction = db.transaction(["pending"], "readwrite")

    //accesss pending object store
    const store = transaction.objectStore("pending")

    //add record to store
    store.add(record)
}

function checkDB() {
    //Open a transaction on pending DB
    const transaction = db.transaction(["pending"], "readwrite")
    //Access pending object store
    const store = transaction.objectStore("pending")
    //Get all records and store them into the getAll variable
    const getAll = store.getAll()

    getAll.onsuccess = function() {
        if (getAll.result.length > 0) {
            fetch("/api/transaction/bulk", {
                method: "POST",
                body: JSON.stringify(getAll.result),
                headers: {
                  Accept: "application/json, text/plain, */*",
                  "Content-Type": "application/json"
                }
        })
        .then(response => response.json())
        .then(() => {
            // if successful, open a transaction on your pending db
            const transaction = db.transaction(["pending"], "readwrite");

            // access your pending object store
            const store = transaction.objectStore("pending");

            // clear all items in your store
            store.clear();
        })
    }}

}
//Listens for application to come back online
window.addEventListener("online", checkDB())