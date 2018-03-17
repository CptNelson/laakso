Game.ItemMixins = {};

// Edible mixins
Game.ItemMixins.Edible = {
    name: 'Edible',
    init: function (template) {
        // Number of points to add to hunger
        this._foodValue = template['foodValue'] || 5;
        // Number of times the item can be consumed
        this._maxConsumptions = template['consumptions'] || 1;
        this._remainingConsumptions = this._maxConsumptions;
    },
    eat: function (entity) {
        if (entity.hasMixin('FoodConsumer')) {
            if (this.hasRemainingConsumptions()) {
                entity.modifyFullnessBy(this._foodValue);
                this._remainingConsumptions--;
            }
        }
    },
    hasRemainingConsumptions: function () {
        return this._remainingConsumptions > 0;
    },
    describe: function () {
        if (this._maxConsumptions != this._remainingConsumptions) {
            return 'partly eaten ' + Game.Item.prototype.describe.call(this);
        } else {
            return this._name;
        }
    },
    listeners: {
        'details': function () {
            return [{ key: 'food', value: this._foodValue }];
        }
    }
};

// Equipment mixins
Game.ItemMixins.Equippable = {
    name: 'Equippable',
    init: function (template) {
        this._attackValue = template['attackValue'] || 0;
        this._damageValue = template['damageValue'] || 0;
        this._archeryValue = template['archeryValue'] || 0;
        this._missileDamageValue = template['missileDamageValue'] || 0;
        this._range = template['range'] || 3;
        this._defenseValue = template['defenseValue'] || 0;
        this._wieldable = template['wieldable'] || false;
        this._wearable = template['wearable'] || false;
        this._amount = template['amount'] || 1;
        this._material = template['material'] || 'wood';
    },
    getAttackValue: function () {
        return this._attackValue;
    },
    getDamageValue: function () {
        return this._damageValue;
    },
    getMissileDamageValue: function () {
        return this._missileDamageValue;
    },
    getArcheryValue: function () {
        return this._archeryValue;
    },
    getRange: function () {
        return this._range;
    },
    getDefenseValue: function () {
        return this._defenseValue;
    },
    isWieldable: function () {
        return this._wieldable;
    },
    isWearable: function () {
        return this._wearable;
    },
    getAmount: function () {
        return this._amount;
    },
    getMaterial: function () {
        return this._material;
    },
    listeners: {
        'details': function () {
            var results = [];
            if (this._wieldable) {
                results.push({ key: 'attack', value: this.getAttackValue() });
            }
            if (this._wearable) {
                results.push({ key: 'defense', value: this.getDefenseValue() });
            }
            return results;
        }
    }
};
Game.ItemMixins.Melee = {
    name: 'Melee',
    init: function (template) {
    }
};
Game.ItemMixins.Bow = {
    name: 'Bow',
    init: function (template) {
    }
};
Game.ItemMixins.Missile = {
    name: 'Missile',
    init: function (template) {

    },
    removeMissile: function (entity) {
        this._amount -= 5;
        console.log(this._amount);
        wielding = entity.getWielding();

        if (this._amount <= 0) {
            Game.sendMessage(entity, 'You have no more ammunition wielded!')
        }
        
    }
};