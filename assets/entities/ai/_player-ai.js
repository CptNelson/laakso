Game.EntityMixins.PlayerAI = {
    name: 'PlayerActor',
    groupName: 'Actor',
    act: function() {
        console.log(this.getX(), this.getY());
        
        if (this._acting) {
            return;
        }
        this._acting = true;
        this.addTurnHunger();
        // Detect if the game is over
        if (!this.isAlive()) {
            Game.Screen.playScreen.setGameEnded(true);
            // Send a last message to the player
            Game.sendMessage(this, 'Press [Enter] to continue!');
        }
        // Re-render the screen
        Game.refresh();
        // Lock the engine and wait asynchronously
        // for the player to press a key.
        this.getMap().getEngine().lock();
        // Clear the message queue
        this.clearMessages();
        
        this.getMap().setTurn(this.getMap().getEngine()._scheduler.getTime(), this.getMap())
        console.log("turn: ", this.getMap().getTurn());
         

        this._acting = false;
    }
};