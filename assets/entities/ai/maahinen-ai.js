Game.EntityMixins.MaahinenAI = {
    name: 'MaahinenAI',
    groupName: 'Actor',
    init: function (template) {

        // Load tasks
        this._tasks = template['tasks'] || ['hunt','goToCenter', 'wander'];
    },
    act: function () {
        // Iterate through all our tasks
        for (var i = 0; i < this._tasks.length; i++) {

            if (this.canDoTask(this._tasks[i])) {

                // If we can perform the task, execute the function for it.
                this[this._tasks[i]]();
                return;
            }
        }
    },
    canDoTask: function (task) {
        if (task === 'hunt') {
            return true;
        } else if (task === 'wander') {
            return true;
        } else {
            throw new Error('Tried to perform undefined task ' + task);
        }
    },
    goToCenter: function () {

        map = this.getMap();
        centerY = map.getWidth() / 2;
        centerX = map.getHeight() / 2;

        
               // If we are adjacent to the center, then attack
        var offsets = Math.abs(centerX - this.getX()) +
               Math.abs(centerY - this.getY());
           if (offsets === 1) {
                   this.wander();
                   return;
           }
   
           // Generate the path and move to the first tile.
           var source = this;
           var z = source.getZ();
           var path = new ROT.Path.AStar(centerX, centerY, function (x, y) {
   
   
               // If an entity is present at the tile, can't move there.
               var entity = source.getMap().getEntityAt(x, y, z);
               if (entity && entity !== source) {
                   return false;
               }
    
               return source.getMap().getTile(x, y, z).isWalkable();
           }, { topology: 8 });
           // Once we've gotten the path, we want to move to the second cell that is
           // passed in the callback (the first is the entity's strting point)
           var count = 0;
           path.compute(source.getX(), source.getY(), function (x, y) {
               if (count == 1) {
                   source.tryMove(x, y, z);
               }
               count++;
           });
       },
    wander: function () {
        
        // Flip coin to determine if moving by 1 in the positive or negative direction
        var moveOffset = (Math.round(Math.random()) === 1) ? 1 : -1;

        // Flip coin to determine if moving in x direction or y direction
        if (Math.round(Math.random()) === 1) {
            this.tryMove(this.getX() + moveOffset, this.getY(), this.getZ());
        } else {
            this.tryMove(this.getX(), this.getY() + moveOffset, this.getZ());

        }
    },
    hunt: function () {
        map = this.getMap()
        target = null;

        tempEntities = map.getEntitiesWithinRadius(this.getX(), this.getY(), this.getZ(), 7)
        for (i = 0; i < tempEntities.length; i++) {
            if (tempEntities[i].hasMixin('Human')) {
                target = tempEntities[i]
            }
        }

        if (target == null) {
            this.goToCenter()
            return
        }

        // If we are adjacent to the target, then attack
        var offsets = Math.abs(target.getX() - this.getX()) +
            Math.abs(target.getY() - this.getY());
        if (offsets === 1) {
                //this.attack(target);
                return;
        }

        // Generate the path and move to the first tile.
        var source = this;
        var z = source.getZ();
        var path = new ROT.Path.AStar(target.getX(), target.getY(), function (x, y) {


            // If an entity is present at the tile, can't move there.
            var entity = source.getMap().getEntityAt(x, y, z);
            if (entity && entity !== target && entity !== source) {
                return false;
            }
            return source.getMap().getTile(x, y, z).isWalkable();
        }, { topology: 8 });
        // Once we've gotten the path, we want to move to the second cell that is
        // passed in the callback (the first is the entity's strting point)
        var count = 0;
        path.compute(source.getX(), source.getY(), function (x, y) {
            if (count == 1) {

                source.tryMove(x, y, z);
            }
            count++;
        });
    },

}