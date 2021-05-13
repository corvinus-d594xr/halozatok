var hotList = [];
var questionsInHotList = 3;
var displayedQuestion;
var numberOfQuestions;
var nextQuestion = 1;
var timerHandler;

document.addEventListener("DOMContentLoaded", () => {
    for (let i = 0; i < questionsInHotList; i++) {
        hotList[i] = {
            question: {},
            goodAnswers: 0
        }
    }

    //kérdések száma
    fetch("questions/count")
        .then(result => result.text())
        .then(n => { numberOfQuestions = parseInt(n) })

    //előre-hátra gombok
    document.getElementById("előre_gomb").addEventListener("click", előre);
    document.getElementById("vissza_gomb").addEventListener("click", hátra);

    //mentett állapot olvasása
    if (localStorage.getItem("hotList")) {
        hotList = JSON.parse(localStorage.getItem("hotList"));
    }
    if (localStorage.getItem("displayedQuestion")) {
        displayedQuestion = parseInt(localStorage.getItem("displayedQuestion"));
    }
    if (localStorage.getItem("nextQuestion")) {
        nextQuestion = parseInt(localStorage.getItem("nextQuestion"));
    }

    //kezdő kérdéslista letöltése

    if (!localStorage.getItem("hotList")) {
        for (let i = 0; i < questionsInHotList; i++) {
            kérdésBetöltés(nextQuestion, i);
            nextQuestion++;
        }
    } else {
        kérdésMegjelenítés();
    }
    
});

function kérdésBetöltés(questionNumber, destination) {
    fetch(`/questions/${questionNumber}`)
        .then(result => {
            if (!result.ok) {

                console.error(`Hibás letöltés: ${result.status}`);
                return null;
            }
            else {
                return result.json();
            }
        })
        .then(q => {
            hotList[destination].question = q;
            hotList[destination].goodAnswer = 0;
            console.log(`A ${questionNumber}. kérdés letöltésre került a hotList ${destination}. helyére`);

            if (displayedQuestion === undefined && destination === 0) {
                displayedQuestion = 0;
                kérdésMegjelenítés();
            }
        })
}

function kérdésMegjelenítés() {
    let kérdés = hotList[displayedQuestion].question;
    document.getElementById("kérdés_szövege").innerText = kérdés.questionText;
    document.getElementById("válasz1").innerText = kérdés.answer1;
    document.getElementById("válasz2").innerText = kérdés.answer2;
    document.getElementById("válasz3").innerText = kérdés.answer3;

    if (kérdés.image) {
        document.getElementById("kép").src = kérdés.image;
        document.getElementById("kép").style.display = "block";
    }
    else {
        document.getElementById("kép").style.display = "none";
    }

    for (var i = 1; i <= 3; i++) document.getElementById("válasz" + i).classList.remove("jó", "rossz")
    document.getElementById("válaszok").style.pointerEvents = "auto";
}

//window.onload = init;

function előre() {
    clearTimeout(timerHandler);
    displayedQuestion++;
    if (displayedQuestion === questionsInHotList) 
    {
        displayedQuestion = 0;
        kérdésMegjelenítés();
    }
}

function hátra() {

    displayedQuestion--;
    if (displayedQuestion < 0) 
    {
        displayedQuestion = questionsInHotList - 1;
        kérdésMegjelenítés();
    }
}

function választás(n) {
    let kérdés = hotList[displayedQuestion].question;
    if (n === kérdés.correctAnswer) {
        document.getElementById("válasz" + n).classList.add("jó")
        hotList[displayedQuestion].goodAnswers++;
        if (hotList[displayedQuestion].goodAnswers === 3) {
            kérdésBetöltés(nextQuestion, displayedQuestion);
            nextQuestion++;
        }
    }
    else {
        document.getElementById("válasz" + n).classList.add("rossz")
        document.getElementById("válasz" + kérdés.correctAnswer).classList.add("jó")
        hotList[displayedQuestion].goodAnswers = 0;
    }

    document.getElementById("válaszok").style.pointerEvents = "none";
    timerHandler = setTimeout(előre, 3000);

    localStorage.setItem("hotList", JSON.stringify(hotList));
    localStorage.setItem("displayedQuestion", displayedQuestion);
    localStorage.setItem("nextQuestion", nextQuestion);
}















