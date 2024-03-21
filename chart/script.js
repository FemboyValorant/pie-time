// 1 minute = 60 seconds = 60000 milliseconds
let totalMinutes = 2;
let totalMilliseconds = totalMinutes * 1000 * 60;
let pauseFlag = false;

const chart = document.querySelector("#cover");

const pauseButton = document.querySelector("#pause");
pauseButton.addEventListener('click', () => {
    switch (true){
        case pauseFlag === false:
            console.log("Paused")
            pauseFlag = true;
            break;
        default:
            console.log("Unpaused");
            pauseFlag = false;
            break;
    }
})

let piePercent = 0;
var t = setInterval(() => {

    if (pauseFlag === false){
        chart.style.background = "conic-gradient( #8A9A5B " + piePercent + "%, rgba(255, 0, 0, 0) 0)";
        piePercent += 0.2;
        if (piePercent > 105){
            clearInterval(t);
        }
    }

        
}, totalMilliseconds/500) 



// }
console.log(chart)