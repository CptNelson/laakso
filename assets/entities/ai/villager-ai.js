Game.EntityMixins.VillagerAI = {
    name: 'VillagerAI',
    groupName: 'Actor',
    init: function (template) {

        // Load tasks
        this._tasks = template['tasks'] || ['wander', 'build']; 
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
}