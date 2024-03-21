// 1 minute = 60000 milliseconds
totalTime = 60000
pieInterval = 

chart = document.querySelector("#cover");
let piePercent = 0;

    
    var t = setInterval(() => {
        chart.style.background = "conic-gradient( #8A9A5B " + piePercent + "%, rgba(255, 0, 0, 0) 0)";
        piePercent += 0.025;
        if (piePercent > 100){
            clearInterval(t);
        }
        
    }, 20) //1/50th of a second 



// }
console.log(chart)