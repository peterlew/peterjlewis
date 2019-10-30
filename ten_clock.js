document.addEventListener("DOMContentLoaded", clockLoop, false);

function get10Time()
{
    var d = new Date();
    var hrs = d.getHours();
    var mins = d.getMinutes();
    var secs = d.getSeconds();
    
    //some basics. 1 standard hr = 60 min = 3600 secs
    //so, in base ten time, 1 hr = 2.4 hrs = 144 min = 8640 secs
    //                      1 min = 14.4 min = 864 secs
    //                      1 sec = 8.64 secs.
    
    var totalSecs = 3600*hrs + 60*mins + secs;
    var totalPctg = totalSecs/86400;    
    
    var btHrs = Math.floor(totalSecs/8640);
    totalSecs = totalSecs % 8640;
    var btMins = Math.floor(totalSecs/864);
    totalSecs = totalSecs % 864;
    var btSecs = Math.floor(totalSecs/8.64);
    

    
    var progCanvas = document.getElementById("dayProg");
    var progCtx = progCanvas.getContext("2d");
    
    progCtx.clearRect(0, 0, progCanvas.width, progCanvas.height);
    
    progCtx.fillStyle = "MediumAquaMarine";
    progCtx.fillRect(0, 0, Math.floor(totalPctg*500), 100);
    
    progCtx.fillStyle = "black";
    progCtx.font = "40px Arial";
    progCtx.textAlign = "center";
    progCtx.textBaseline = "middle";
    
    if(btSecs < 10)
        var secString = "0" + btSecs.toString();
    else var secString = btSecs.toString();
    
    progCtx.fillText((10*btHrs + btMins + btSecs/100).toFixed(2)
                       + " %", 250, 50);    
    
    return (btHrs.toString() + ":" + btMins.toString() 
            + ":" + secString);
    
}

function clockLoop()
{
    var clkTxt = document.getElementById("clockText");
    clkTxt.innerHTML = "The current time is " + get10Time();
    setTimeout("clockLoop()", 1000);
}