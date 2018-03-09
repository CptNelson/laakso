Game.EntityMixins.VillagerAI = {
    name: 'VillagerAI',
    groupName: 'Actor',
    init: function (template) {

        // Load tasks
        this._tasks = template['tasks'] || ['build', 'wander'];
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
        if (task === 'build') {
            return true;
        } else if (task === 'wander') {
            return true;
        } else {
            throw new Error('Tried to perform undefined task ' + task);
        }
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
    build: function () {
        map = this.getMap()
        target = null;

        /* 
            check if there's construction tiles in the map
            find path to nearest one
            go to it and start building
        */

        // console.log(map.getHeight());
        tempEntities = map.getEntitiesWithinRadius(this.getX(), this.getY(), this.getZ(), 40)
            for (i = 0; i < tempEntities.length; i++) {
                    if (tempEntities[i].hasMixin('Prop')) {
                        target = tempEntities[i]           
                    } 
                }               
        //console.log(target);
        
        if (target == null){
           // console.log("23");          
            this.wander()
            return
        }
      //  console.log(target);



        // If we are adjacent to the target, then start building.
        var offsets = Math.abs(target.getX() - this.getX()) +
            Math.abs(target.getY() - this.getY());
        if (offsets === 1) {
            target.setProgress(null, 10);
            //console.log(target.getProgress());       
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