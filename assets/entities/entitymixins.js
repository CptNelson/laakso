// Create our Mixins namespace
Game.EntityMixins = {};


Game.EntityMixins.Human = {
    name: 'Human',
    groupName: 'Actor'
}

Game.EntityMixins.Archer = {
    name: 'Archer',
    groupName: 'Attacker',
    init: function (template) {
        this._archeryValue = template['archeryValue'] || 0;
    },
    getArcheryValue: function () {       
        var modifier = 0;
        // check for equipment
        if (this.hasMixin(Game.EntityMixins.Equipper)) {
            if (this.getWeapon()) {  
                modifier += this.getWeapon().getArcheryValue();
            }
            if (this.getArmor()) {
                modifier += this.getArmor().getArcheryValue();
            }
        }
        
        return this._archeryValue + modifier
    },
    increaseArcheryValue: function (value) {
        // If no value was passed, default to 2.
        value = value || 2;
        // Add to the attack value.
        this._archeryValue += 2;
        Game.sendMessage(this, "You got better at shooting things!");
    },
    shoot: function (target, shotRange) {
        // If the target is destructible, calculate the damage
        // based on attack and defense value
        console.log(this.getWeapon().getRange());
        
        if (target.hasMixin('Destructible') && shotRange <= this.getWeapon().getRange()) {
            console.log(shotRange);
            
            var archery = this.getArcheryValue();
            
            var defense = target.getDefenseValue();
            var max = Math.max(0, archery - defense);
            console.log(archery);
            
            var damage = 1 + Math.floor(Math.random() * max);

            Game.sendMessage(this, 'You shoot %s for %d damage!',
                [target.getName(), damage]);
            Game.sendMessage(target, '%s shoots you for %d damage!',
                [this.getName(), damage]);

            target.takeDamage(this, damage);
        } else {
            Game.sendMessage(this, '%s is too far!', [target.getName()])
        }
    },
    listeners: {
        details: function () {
            return [{ key: 'shoot', value: this.getArcheryValue() }];
        }
    }
}
// This signifies our entity can attack basic destructible enities
Game.EntityMixins.Attacker = {
    name: 'Attacker',
    groupName: 'Attacker',
    init: function (template) {
        this._attackValue = template['attackValue'] || 1;
    },
    getAttackValue: function () {
        var modifier = 0;
        // If we can equip items, then have to take into 
        // consideration weapon and armor
        if (this.hasMixin(Game.EntityMixins.Equipper)) {
            if (this.getWeapon()) {
                modifier += this.getWeapon().getAttackValue();
            }
            if (this.getArmor()) {
                modifier += this.getArmor().getAttackValue();
            }
        }
        return this._attackValue + modifier;
    },
    increaseAttackValue: function (value) {
        // If no value was passed, default to 2.
        value = value || 2;
        // Add to the attack value.
        this._attackValue += 2;
        Game.sendMessage(this, "You look stronger!");
    },
    attack: function (target) {
        // If the target is destructible, calculate the damage
        // based on attack and defense value
        if (target.hasMixin('Destructible')) {
            var attack = this.getAttackValue();
            var defense = target.getDefenseValue();
            var max = Math.max(0, attack - defense);
            var damage = 1 + Math.floor(Math.random() * max);

            Game.sendMessage(this, 'You strike %s for %d damage!',
                [target.getName(), damage]);
            Game.sendMessage(target, '%s strikes you for %d damage!',
                [this.getName(), damage]);

            target.takeDamage(this, damage);
        }
    },
    listeners: {
        details: function () {
            return [{ key: 'attack', value: this.getAttackValue() }];
        }
    }
};

// This mixin signifies an entity can take damage and be destroyed
Game.EntityMixins.Destructible = {
    name: 'Destructible',
    init: function (template) {
        this._maxHp = template['maxHp'] || 10;
        // We allow taking in health from the template incase we want
        // the entity to start with a different amount of HP than the 
        // max specified.
        this._hp = template['hp'] || this._maxHp;
        this._defenseValue = template['defenseValue'] || 0;
    },
    getDefenseValue: function () {
        var modifier = 0;
        // If we can equip items, then have to take into 
        // consideration weapon and armor
        if (this.hasMixin(Game.EntityMixins.Equipper)) {
            if (this.getWeapon()) {
                modifier += this.getWeapon().getDefenseValue();
            }
            if (this.getArmor()) {
                modifier += this.getArmor().getDefenseValue();
            }
        }
        return this._defenseValue + modifier;
    },
    getHp: function () {
        return this._hp;
    },
    getMaxHp: function () {
        return this._maxHp;
    },
    setHp: function (hp) {
        this._hp = hp;
    },
    increaseDefenseValue: function (value) {
        // If no value was passed, default to 2.
        value = value || 2;
        // Add to the defense value.
        this._defenseValue += 2;
        Game.sendMessage(this, "You look tougher!");
    },
    increaseMaxHp: function (value) {
        // If no value was passed, default to 10.
        value = value || 10;
        // Add to both max HP and HP.
        this._maxHp += 10;
        this._hp += 10;
        Game.sendMessage(this, "You look healthier!");
    },
    takeDamage: function (attacker, damage) {
        this._hp -= damage;
        // If have 0 or less HP, then remove ourseles from the map
        if (this._hp <= 0) {
            Game.sendMessage(attacker, 'You kill %s!', [this.getName()]);
            // Raise events
            this.raiseEvent('onDeath', attacker);
            attacker.raiseEvent('onKill', this);
            this.kill();
        }
    },
    listeners: {
        onGainLevel: function () {
            // Heal the entity.
            this.setHp(this.getMaxHp());
        },
        details: function () {
            return [
                { key: 'defense', value: this.getDefenseValue() },
                { key: 'hp', value: this.getHp() }
            ];
        }
    }
};

Game.EntityMixins.MessageRecipient = {
    name: 'MessageRecipient',
    init: function (template) {
        this._messages = [];
    },
    receiveMessage: function (message) {
        this._messages.push(message);
    },
    getMessages: function () {
        return this._messages;
    },
    clearMessages: function () {
        this._messages = [];
    }
};

// This signifies our entity posseses a field of vision of a given radius.
Game.EntityMixins.Sight = {
    name: 'Sight',
    groupName: 'Sight',
    init: function (template) {
        this._sightRadius = template['sightRadius'] || 5;
    },
    getSightRadius: function () {
        return this._sightRadius;
    },
    increaseSightRadius: function (value) {
        // If no value was passed, default to 1.
        value = value || 1;
        // Add to sight radius.
        this._sightRadius += 1;
        Game.sendMessage(this, "You are more aware of your surroundings!");
    },
    canSee: function (entity) {
        // If not on the same map or on different floors, then exit early
        if (!entity || this._map !== entity.getMap() || this._z !== entity.getZ()) {
            return false;
        }

        var otherX = entity.getX();
        var otherY = entity.getY();

        // If we're not in a square field of view, then we won't be in a real
        // field of view either.
        if ((otherX - this._x) * (otherX - this._x) +
            (otherY - this._y) * (otherY - this._y) >
            this._sightRadius * this._sightRadius) {
            return false;
        }

        // Compute the FOV and check if the coordinates are in there.
        var found = false;
        this.getMap().getFov(this.getZ()).compute(
            this.getX(), this.getY(),
            this.getSightRadius(),
            function (x, y, radius, visibility) {
                if (x === otherX && y === otherY) {
                    found = true;
                }
            });
        return found;
    }
};

// Message sending functions
Game.sendMessage = function (recipient, message, args) {
    // Make sure the recipient can receive the message 
    // before doing any work.
    if (recipient.hasMixin(Game.EntityMixins.MessageRecipient)) {
        // If args were passed, then we format the message, else
        // no formatting is necessary
        if (args) {
            message = vsprintf(message, args);
        }
        recipient.receiveMessage(message);
    }
};
Game.sendMessageNearby = function (map, centerX, centerY, centerZ, message, args) {
    // If args were passed, then we format the message, else
    // no formatting is necessary
    if (args) {
        message = vsprintf(message, args);
    }
    // Get the nearby entities
    entities = map.getEntitiesWithinRadius(centerX, centerY, centerZ, 5);
    // Iterate through nearby entities, sending the message if
    // they can receive it.
    for (var i = 0; i < entities.length; i++) {
        if (entities[i].hasMixin(Game.EntityMixins.MessageRecipient)) {
            entities[i].receiveMessage(message);
        }
    }
};

Game.EntityMixins.InventoryHolder = {
    name: 'InventoryHolder',
    init: function (template) {
        // Default to 10 inventory slots.
        var inventorySlots = template['inventorySlots'] || 10;
        // Set up an empty inventory.
        this._items = new Array(inventorySlots);
    },
    getItems: function () {
        return this._items;
    },
    getItem: function (i) {
        return this._items[i];
    },
    addItem: function (item) {
        // Try to find a slot, returning true only if we could add the item.
        for (var i = 0; i < this._items.length; i++) {
            if (!this._items[i]) {
                this._items[i] = item;
                return true;
            }
        }
        return false;
    },
    removeItem: function (i) {
        // If we can equip items, then make sure we unequip the item we are removing.
        if (this._items[i] && this.hasMixin(Game.EntityMixins.Equipper)) {
            this.unequip(this._items[i]);
        }
        // Simply clear the inventory slot.
        this._items[i] = null;
    },
    canAddItem: function () {
        // Check if we have an empty slot.
        for (var i = 0; i < this._items.length; i++) {
            if (!this._items[i]) {
                return true;
            }
        }
        return false;
    },
    pickupItems: function (indices) {
        // Allows the user to pick up items from the map, where indices is
        // the indices for the array returned by map.getItemsAt
        var mapItems = this._map.getItemsAt(this.getX(), this.getY(), this.getZ());
        var added = 0;
        // Iterate through all indices.
        for (var i = 0; i < indices.length; i++) {
            // Try to add the item. If our inventory is not full, then splice the 
            // item out of the list of items. In order to fetch the right item, we
            // have to offset the number of items already added.
            if (this.addItem(mapItems[indices[i] - added])) {
                mapItems.splice(indices[i] - added, 1);
                added++;
            } else {
                // Inventory is full
                break;
            }
        }
        // Update the map items
        this._map.setItemsAt(this.getX(), this.getY(), this.getZ(), mapItems);
        // Return true only if we added all items
        return added === indices.length;
    },
    dropItem: function (i) {
        // Drops an item to the current map tile
        if (this._items[i]) {
            if (this._map) {
                this._map.addItem(this.getX(), this.getY(), this.getZ(), this._items[i]);
            }
            this.removeItem(i);
        }
    }
};

Game.EntityMixins.FoodConsumer = {
    name: 'FoodConsumer',
    init: function (template) {
        this._maxFullness = template['maxFullness'] || 5000;
        // Start halfway to max fullness if no default value
        this._fullness = template['fullness'] || (this._maxFullness);
        // Number of points to decrease fullness by every turn.
        this._fullnessDepletionRate = template['fullnessDepletionRate'] || 1;
    },
    addTurnHunger: function () {
        // Remove the standard depletion points
        this.modifyFullnessBy(-this._fullnessDepletionRate);
    },
    modifyFullnessBy: function (points) {
        this._fullness = this._fullness + points;
        if (this._fullness <= 0) {
            this.kill("You have died of starvation!");
        } else if (this._fullness > this._maxFullness) {
            this.kill("You choke and die!");
        }
    },
    getHungerState: function () {
        // Fullness points per percent of max fullness
        var perPercent = this._maxFullness / 100;
        // 5% of max fullness or less = starving
        if (this._fullness <= perPercent * 5) {
            return 'Starving';
            // 25% of max fullness or less = hungry
        } else if (this._fullness <= perPercent * 25) {
            return 'Hungry';
            // 95% of max fullness or more = oversatiated
        } else if (this._fullness >= perPercent * 95) {
            return 'Oversatiated';
            // 75% of max fullness or more = full
        } else if (this._fullness >= perPercent * 75) {
            return 'Full';
            // Anything else = not hungry
        } else {
            return 'Not Hungry';
        }
    }
};

Game.EntityMixins.CorpseDropper = {
    name: 'CorpseDropper',
    init: function (template) {
        // Chance of dropping a cropse (out of 100).
        this._corpseDropRate = template['corpseDropRate'] || 100;
    },
    listeners: {
        onDeath: function (attacker) {
            // Check if we should drop a corpse.
            if (Math.round(Math.random() * 100) <= this._corpseDropRate) {
                // Create a new corpse item and drop it.
                this._map.addItem(this.getX(), this.getY(), this.getZ(),
                    Game.ItemRepository.create('corpse', {
                        name: this._name + ' corpse',
                        foreground: this._foreground
                    }));
            }
        }
    }
};

Game.EntityMixins.Equipper = {
    name: 'Equipper',
    init: function (template) {
        this._weapon = null;
        this._armor = null;
    },
    wield: function (item) {
        this._weapon = item;
    },
    unwield: function () {
        this._weapon = null;
    },
    wear: function (item) {
        this._armor = item;
    },
    takeOff: function () {
        this._armor = null;
    },
    getWeapon: function () {
        return this._weapon;
    },
    getArmor: function () {
        return this._armor;
    },
    unequip: function (item) {
        // Helper function to be called before getting rid of an item.
        if (this._weapon === item) {
            this.unwield();
        }
        if (this._armor === item) {
            this.takeOff();
        }
    }
};

Game.EntityMixins.ExperienceGainer = {
    name: 'ExperienceGainer',
    init: function (template) {
        this._level = template['level'] || 1;
        this._experience = template['experience'] || 0;
        this._statPointsPerLevel = template['statPointsPerLevel'] || 1;
        this._statPoints = 0;
        // Determine what stats can be levelled up.
        this._statOptions = [];
        if (this.hasMixin('Attacker')) {
            this._statOptions.push(['Increase attack value', this.increaseAttackValue]);
        }
        if (this.hasMixin('Destructible')) {
            this._statOptions.push(['Increase defense value', this.increaseDefenseValue]);
            this._statOptions.push(['Increase max health', this.increaseMaxHp]);
        }
        if (this.hasMixin('Sight')) {
            this._statOptions.push(['Increase sight range', this.increaseSightRadius]);
        }
    },
    getLevel: function () {
        return this._level;
    },
    getExperience: function () {
        return this._experience;
    },
    getNextLevelExperience: function () {
        return (this._level * this._level) * 10;
    },
    getStatPoints: function () {
        return this._statPoints;
    },
    setStatPoints: function (statPoints) {
        this._statPoints = statPoints;
    },
    getStatOptions: function () {
        return this._statOptions;
    },
    giveExperience: function (points) {
        var statPointsGained = 0;
        var levelsGained = 0;
        // Loop until we've allocated all points.
        while (points > 0) {
            // Check if adding in the points will surpass the level threshold.
            if (this._experience + points >= this.getNextLevelExperience()) {
                // Fill our experience till the next threshold.
                var usedPoints = this.getNextLevelExperience() - this._experience;
                points -= usedPoints;
                this._experience += usedPoints;
                // Level up our entity!
                this._level++;
                levelsGained++;
                this._statPoints += this._statPointsPerLevel;
                statPointsGained += this._statPointsPerLevel;
            } else {
                // Simple case - just give the experience.
                this._experience += points;
                points = 0;
            }
        }
        // Check if we gained at least one level.
        if (levelsGained > 0) {
            Game.sendMessage(this, "You advance to level %d.", [this._level]);
            this.raiseEvent('onGainLevel');
        }
    },
    listeners: {
        onKill: function (victim) {
            var exp = victim.getMaxHp() + victim.getDefenseValue();
            if (victim.hasMixin('Attacker')) {
                exp += victim.getAttackValue();
            }
            // Account for level differences
            if (victim.hasMixin('ExperienceGainer')) {
                exp -= (this.getLevel() - victim.getLevel()) * 3;
            }
            // Only give experience if more than 0.
            if (exp > 0) {
                this.giveExperience(exp);
            }
        },
        details: function () {
            return [{ key: 'level', value: this.getLevel() }];
        }
    }
};

Game.EntityMixins.RandomStatGainer = {
    name: 'RandomStatGainer',
    groupName: 'StatGainer',
    listeners: {
        onGainLevel: function () {
            var statOptions = this.getStatOptions();
            // Randomly select a stat option and execute the callback for each
            // stat point.
            while (this.getStatPoints() > 0) {
                // Call the stat increasing function with this as the context.
                statOptions.random()[1].call(this);
                this.setStatPoints(this.getStatPoints() - 1);
            }
        }
    }
};

Game.EntityMixins.PlayerStatGainer = {
    name: 'PlayerStatGainer',
    groupName: 'StatGainer',
    listeners: {
        onGainLevel: function () {
            // Setup the gain stat screen and show it.
            Game.Screen.gainStatScreen.setup(this);
            Game.Screen.playScreen.setSubScreen(Game.Screen.gainStatScreen);
        }
    }
};
Game.EntityMixins.Prop = {
    name: 'Prop',
    groupName: 'Props',

}
Game.EntityMixins.Buildable = {
    name: 'Buildable',
    groupName: 'Construction',
    init: function (template) {
        this._maxProgress = template['maxProgress'] || 100;
        this._progress = template['progress'] || 1;
    },
    getProgress: function () {
        return this._progress;
    },
    // setProgress(null, 10) to add 10
    setProgress: function (val, plus) {
        this._progress = (val || this._progress) + (plus || 0)
        if (this._progress >= this._maxProgress) {
            this.getMap()._tiles[this.getZ()][this.getX()][this.getY()] = Game.Tile.wallTile;
            this.kill();
        }
    },
    changeToItem: function (item, amount) {
        for (i = 0; i <= amount; i++) {
            this._map.addItem(this.getX(), this.getY(), this.getZ(), item)
        }
        this.kill()
    }

};
Game.EntityMixins.Carpenter = {
    name: 'Carpenter',
    groupName: 'Villager',
    init: function (template) {

    },
    cutTree: function (targetProp, target) {
        target.setHitpoints(10)
        console.log(target.getHitpoints());
        if (target.getHitpoints() <= 0) {
            console.log(targetProp);
            targetProp.getMap()._tiles[targetProp.getZ()][targetProp.getX()][targetProp.getY()] = Game.Tile.floorTile;
            targetProp.changeToItem(Game.ItemRepository.create('wood'),
                Math.floor(Math.random() * 8) + 5);
        }
    }
};
