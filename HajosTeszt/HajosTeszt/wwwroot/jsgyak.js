window.onload = () => {

    var faktorialisR = function (n) {
        if (n === 0 || n === 1) {
            return 1;
        }
        else {
            return n * faktorialisR(n - 1)
        }
    }

    let hova = document.getElementById("ide")
    hova.innerHTML = ""

    for (var i = 0; i < 10; i++) {
        let sor = document.createElement("div")
        document.body.appendChild(sor)
        sor.classList.add("egymas_melle")
        for (var j = 0; j <= i; j++) {
            let szam = document.createElement("button")
            sor.appendChild(szam)
            szam.innerText = (i + 1) * (j + 1)
            szam.classList.add("doboz")
            szam.innerText = faktorialisR(i) / (faktorialisR(j) * faktorialisR(i-j))
            szam.style.color=`rgb(${255/10*i},0,${255/10*j})`
        }
    }
}
