// 1 minute = 60 seconds = 60000 milliseconds
let totalMinutes = 0.5;
let totalMilliseconds = totalMinutes * 1000 * 60;
let pauseFlag = false;

const chart = document.querySelector("#cover");

const pauseButton = document.querySelector("#pause");
pauseButton.addEventListener('click', () => {
    switch (true){
        case pauseFlag === false:
            console.log("Paused");
            document.querySelector("#pause").src = "images/play.png";
            pauseFlag = true;
            break;
        default:
            console.log("Unpaused");
            document.querySelector("#pause").src = "images/pause.png";
            pauseFlag = false;
            break;
    }
})

const extendButton = document.querySelector("#extend");
extendButton.addEventListener('click', () => piePercent -= document.querySelector("#extendpercent").value)

const percentDisplay = document.querySelector("#percent");
let piePercent = 0;
var t = setInterval(() => {

    if (pauseFlag === false){
        if (piePercent < 0){
            piePercent = 0;
        }

        chart.style.background = "conic-gradient(#8A9A5B " + piePercent + "%, rgba(255, 0, 0, 0) 0)";
        piePercent += 0.2;

        percentDisplay.textContent = piePercent.toFixed(1) + "%";

        if (piePercent > 100){
            percentDisplay.textContent = "Done!";
        }
        
        if (piePercent > 105){
            clearInterval(t);
        }
    }

        
}, totalMilliseconds/500) 



// }
console.log(chart)