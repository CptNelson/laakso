Game.Events = function() {
  
},

Game.Events.prototype.turnDone = function(events, turn, map) {
    console.log("event turn done")
    if (turn == 5) {
        console.log("it's turn five.")
        events.releaseMaahiset(map);
    }
},

Game.Events.prototype.releaseMaahiset = function() {
    
    for (i = 0; i < 4; i++) {
        var maahinen = Game.EntityRepository.create('maahinen');
        maahinen._name = Game.NameGenerator();
        map.addEntityAtRandomPosition(maahinen, 0);
    }
}