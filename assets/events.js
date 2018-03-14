Game.Events = function() {
  
},

Game.Events.prototype.turnDone = function(events, turn, map) {
    console.log("event turn done")
    if (turn == 50 || turn == 75) {
        console.log("it's turn five.")
        events.releaseMaahiset(map);
    }
},

Game.Events.prototype.releaseMaahiset = function(map) {    
    for (i = 0; i < 2; i++) {
        var maahinen = Game.EntityRepository.create('maahinen');
        maahinen._name = Game.NameGenerator();
        map.addEntityAtBorder(maahinen,0, false, 1);
    }
}