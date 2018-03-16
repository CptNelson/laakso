Game.Events = function() {
  
},

Game.Events.prototype.turnDone = function(events, turn, map) {
    if (turn == 5 || turn == 55) {
        console.log("it's turn five.")
        events.releaseMaahiset(map);
    }
},

Game.Events.prototype.releaseMaahiset = function(map) {    
    for (i = 0; i < 2; i++) {
        var maahinen = Game.EntityRepository.create('maahinen');
        map.addEntityAtBorder(maahinen,0, false, 1);
    }
}