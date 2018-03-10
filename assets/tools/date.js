// TODO: working date system.

Game.Date = function (){
    seconds = null,
    minutes = null,
    hours = null,            console.log(target.getProgress());    
    days = null,
    months = null,
    years = null
}

Game.Date.prototype.getSeconds = function() {
    return seconds;
}
Game.Date.prototype.setSeconds = function(sec) {
    newSecs = sec - seconds
    seconds += newSecs;
    if (seconds > 60) {
        leftover = seconds - 60
        minutes += 1;
        seconds = leftover;
    }
    console.log(seconds, " ", minutes);
    
}