Game.Screen = {}

Game.Screen.startScreen = {
    enter: function () { console.log("Entered start screen."); },
    exit: function () { console.log("Exited start screen."); },
    render: function (display) {
        // Render our prompt to the screen
        display.drawText(1, 1, "%c{yellowgreen}Welcome to Laakso.");
        display.drawText(1, 2, "Press [Enter] to start!");
    },
    handleInput: function (inputType, inputData) {
        // When [Enter] is pressed, go to the play screen
        if (inputType === 'keydown') {
            if (inputData.keyCode === ROT.VK_RETURN) {
                Game.switchScreen(Game.Screen.playScreen);
            }
        }
    }
};


Game.Screen.playScreen = {
    _player: null,
    _gameEnded: false,
    _subScreen: null,
    enter: function () {
        // Create a map based on our size parameters
        var width = 60;
        var height = 40;
        var depth = 1;
        // Create our map from the tiles and player
        this._player = new Game.Entity(Game.PlayerTemplate);
        var tiles = new Game.Builder(width, height, depth).getTiles();
        var map = new Game.Map.Village(tiles, this._player);
        // Start the map's engine
        map.getEngine().start();
    },
    exit: function () { console.log("Exited play screen."); },
    render: function (display) {
        // Render subscreen if there is one
        if (this._subScreen) {
            this._subScreen.render(display);
            return;
        }

        var screenWidth = Game.getScreenWidth();
        var screenHeight = Game.getScreenHeight();

        // Render the tiles
        this.renderTiles(display);

        // Get the messages in the player's queue and render them
        var messages = this._player.getMessages();
        var messageY = screenHeight + 2;
        for (var i = 0; i < messages.length; i++) {
            // Draw each message, adding the number of lines
            messageY += display.drawText(
                0,
                messageY,
                '%c{white}%b{black}' + messages[i]
            );
        }
        // Render player stats
        var stats = '%c{greenyellow}%b{black}';
        stats += vsprintf('HP: %d/%d L: %d XP: %d',
            [this._player.getHp(), this._player.getMaxHp(),
            this._player.getLevel(), this._player.getExperience()]);
        display.drawText(0, screenHeight + 1, stats);
        // Render hunger state
        var hungerState = '%c{greenyellow}%b{black}';
        hungerState += vsprintf('%s', [this._player.getHungerState()]);
        display.drawText(screenWidth - hungerState.length / 2, screenHeight + 1, hungerState);
    },
    getScreenOffsets: function () {
        // Make sure we still have enough space to fit an entire game screen
        var topLeftX = Math.max(0, this._player.getX() - (Game.getScreenWidth() / 2));
        // Make sure we still have enough space to fit an entire game screen
        topLeftX = Math.min(topLeftX, this._player.getMap().getWidth() -
            Game.getScreenWidth());
        // Make sure the y-axis doesn't above the top bound
        var topLeftY = Math.max(0, this._player.getY() - (Game.getScreenHeight() / 2));
        // Make sure we still have enough space to fit an entire game screen
        topLeftY = Math.min(topLeftY, this._player.getMap().getHeight() - Game.getScreenHeight());
        return {
            x: topLeftX,
            y: topLeftY
        };
    },
    renderTiles: function (display) {
        var screenWidth = Game.getScreenWidth();
        var screenHeight = Game.getScreenHeight();
        var offsets = this.getScreenOffsets();
        var topLeftX = offsets.x;
        var topLeftY = offsets.y;
        // This object will keep track of all visible map cells
        var visibleCells = {};
        // Store this._player.getMap() and player's z to prevent losing it in callbacks
        var map = this._player.getMap();
        var currentDepth = this._player.getZ();
        // Find all visible cells and update the object
        map.getFov(currentDepth).compute(
            this._player.getX(), this._player.getY(),
            this._player.getSightRadius(),
            function (x, y, radius, visibility) {
                visibleCells[x + "," + y] = true;
                // Mark cell as explored
                map.setExplored(x, y, currentDepth, true);
            });
        // Render the explored map cells
        for (var x = topLeftX; x < topLeftX + screenWidth; x++) {
            for (var y = topLeftY; y < topLeftY + screenHeight; y++) {
                if (map.isExplored(x, y, currentDepth)) {
                    // Fetch the glyph for the tile and render it to the screen
                    // at the offset position.
                    var glyph = map.getTile(x, y, currentDepth);
                    var foreground = glyph.getForeground();
                    // If we are at a cell that is in the field of vision, we need
                    // to check if there are items or entities.
                    if (visibleCells[x + ',' + y]) {
                        // Check for items first, since we want to draw entities
                        // over items.
                        var items = map.getItemsAt(x, y, currentDepth);
                        // If we have items, we want to render the top most item
                        if (items) {
                            glyph = items[items.length - 1];
                        }
                        // Check if we have an entity at the position
                        if (map.getEntityAt(x, y, currentDepth)) {
                            glyph = map.getEntityAt(x, y, currentDepth);
                        }
                        // Update the foreground color in case our glyph changed
                        foreground = glyph.getForeground();
                    } else {
                        // Since the tile was previously explored but is not 
                        // visible, we want to change the foreground color to
                        // dark gray.
                        foreground = 'darkGray';
                    }
                    display.draw(
                        x - topLeftX,
                        y - topLeftY,
                        glyph.getChar(),
                        foreground,
                        glyph.getBackground());
                }
            }
        }
    },
    handleInput: function (inputType, inputData) {

        // If the game is over, enter will bring the user to the losing screen.
        if (this._gameEnded) {
            if (inputType === 'keydown' && inputData.keyCode === ROT.VK_RETURN) {
                Game.switchScreen(Game.Screen.loseScreen);
            }
            // Return to make sure the user can't still play
            return;
        }
        // Handle subscreen input if there is one
        if (this._subScreen) {
            this._subScreen.handleInput(inputType, inputData);
            return;
        }
        if (inputType === 'keydown') {
            // Movement
            if (inputData.keyCode === ROT.VK_LEFT || inputData.keyCode === 100) {
                this.move(-1, 0, 0);
            } else if (inputData.keyCode === ROT.VK_RIGHT || inputData.keyCode === 102) {
                this.move(1, 0, 0);
            } else if (inputData.keyCode === ROT.VK_UP || inputData.keyCode === 104) {
                this.move(0, -1, 0);
            } else if (inputData.keyCode === ROT.VK_DOWN || inputData.keyCode === 98) {
                this.move(0, 1, 0);
            } else if (inputData.keyCode === 97) {
                this.move(-1, 1, 0);
            } else if (inputData.keyCode === 99) {
                this.move(1, 1, 0);
            } else if (inputData.keyCode === 103) {
                this.move(-1, -1, 0);
            } else if (inputData.keyCode === 105) {
                this.move(1, -1, 0);
            } else if (inputData.keyCode === 101) {
                this.wait();
            } else if (inputData.keyCode === ROT.VK_M) {
                this.markForBuilding();
            } else if (inputData.keyCode === ROT.VK_1) {
                // Setup the look screen.   
                this.useHands(0);
                return;
            } else if (inputData.keyCode === ROT.VK_2) {
                // Setup the look screen.   
                this.useHands(1);
                return;
            } else if (inputData.keyCode === ROT.VK_I) {
                // Show the inventory screen
                scr = Game.Screen.inventoryScreen
                this.showItemsSubScreen(scr, this._player.getItems(),
                    'You are not carrying anything.');
                return;
            } else if (inputData.keyCode === ROT.VK_D) {
                // Show the drop screen
                this.showItemsSubScreen(Game.Screen.dropScreen, this._player.getItems(),
                    'You have nothing to drop.');
                return;
            } else if (inputData.keyCode === ROT.VK_E) {
                // Show the drop screen
                this.showItemsSubScreen(Game.Screen.eatScreen, this._player.getItems(),
                    'You have nothing to eat.');
                return;
            } else if (inputData.keyCode === ROT.VK_W) {
                if (inputData.shiftKey) {
                    // Show the wear screen
                    this.showItemsSubScreen(Game.Screen.wearScreen, this._player.getItems(),
                        'You have nothing to wear.');
                } else {
                    // Show the wield screen
                    this.showItemsSubScreen(Game.Screen.wieldSecondaryScreen, this._player.getItems(),
                        'You have nothing to wield.');
                }
                return;
            } else if (inputData.keyCode === ROT.VK_Q) {

                // Show the wield screen
                this.showItemsSubScreen(Game.Screen.wieldPrimaryScreen, this._player.getItems(),
                    'You have nothing to wield.');

                return;
            } else if (inputData.keyCode === ROT.VK_X) {
                // Show the drop screen
                this.showItemsSubScreen(Game.Screen.examineScreen, this._player.getItems(),
                    'You have nothing to examine.');
                return;
            } else if (inputData.keyCode === ROT.VK_COMMA) {
                var items = this._player.getMap().getItemsAt(this._player.getX(),
                    this._player.getY(), this._player.getZ());
                // If there is only one item, directly pick it up
                if (items && items.length === 1) {
                    var item = items[0];
                    if (this._player.pickupItems([0])) {
                        Game.sendMessage(this._player, "You pick up %s.", [item.describeA()]);
                    } else {
                        Game.sendMessage(this._player, "Your inventory is full! Nothing was picked up.");
                    }
                } else {
                    this.showItemsSubScreen(Game.Screen.pickupScreen, items,
                        'There is nothing here to pick up.');
                }
            } else {
                // Not a valid key
                return;
            }
            // Unlock the engine
            this._player.getMap().getEngine().unlock();
        } else if (inputType === 'keypress') {
            var keyChar = String.fromCharCode(inputData.charCode);
            if (keyChar === '>') {
                this.move(0, 0, 1);
            } else if (keyChar === '<') {
                this.move(0, 0, -1);
            } else if (keyChar === 'l') {
                // Setup the look screen.
                var offsets = this.getScreenOffsets();
                Game.Screen.lookScreen.setup(this._player,
                    this._player.getX(), this._player.getY(),
                    offsets.x, offsets.y);
                this.setSubScreen(Game.Screen.lookScreen);
                return;
            } else if (keyChar === '?') {
                // Setup the look screen.
                this.setSubScreen(Game.Screen.helpScreen);
                return;
            } else {
                // Not a valid key
                return;
            }
            // Unlock the engine
            this._player.getMap().getEngine().unlock();
        }
    },
    useHands: function (h) { 
       
        if (this.checkHand(h) == 'projectile') {
            var offsets = this.getScreenOffsets();
            Game.Screen.targetScreen.setup(this._player,
                this._player.getX(), this._player.getY(), offsets.x, offsets.y);
            this.setSubScreen(Game.Screen.targetScreen);
        } else if (this.checkHand(h) == 'melee'){
            console.log("melee");
            
            Game.Screen.meleeDirectionScreen.setup(this._player);
            this.setSubScreen(Game.Screen.meleeDirectionScreen);
            
        } else if (this.checkHand(h) == 'fist') {
                
                Game.Screen.meleeDirectionScreen.setup(this._player);
                this.setSubScreen(Game.Screen.meleeDirectionScreen);

        } else console.log('false');
        
    },
    checkHand: function (hand) {
        wielding = this._player.getWielding();
        if (wielding[0] != null && wielding[1] != null) {
            if ((wielding[0].hasMixin('Bow') || wielding[0].hasMixin('Missile')
                && wielding[0].getAmount() >= 1) &&
               ((wielding[1].hasMixin('Bow') || wielding[1].hasMixin('Missile')
                && wielding[0].getAmount() >= 1))) {
                return 'projectile';
            } else if (wielding[hand].hasMixin('Melee')) {
                return 'melee';
            }
        } else if (wielding[hand] != null && wielding[hand].hasMixin('Melee')) {
                return 'melee';
                    
        } else if (wielding[hand] == null) {
            return 'fist'
        } else return false;
    },
    wait: function () {
        Game.Map.prototype.addAction(this._player.getMap(), 1);
    },
    markForBuilding: function () {
        var entity = Game.EntityRepository.create('construct');
        entity.setZ(this._player.getZ())
        entity.setX(this._player.getX())
        entity.setY(this._player.getY())
        console.log(entity.getX(), " ", entity.getY());

        map = this._player.getMap()
        Game.Map.prototype.addEntityHere(entity, map)


    },
    move: function (dX, dY, dZ) {
        var newX = this._player.getX() + dX;
        var newY = this._player.getY() + dY;
        var newZ = this._player.getZ() + dZ;
        // Try to move to the new cell
        this._player.tryMove(newX, newY, newZ, this._player.getMap());
    },
    setGameEnded: function (gameEnded) {
        this._gameEnded = gameEnded;
    },
    setSubScreen: function (subScreen) {
        this._subScreen = subScreen;
        // Refresh screen on changing the subscreen
        Game.refresh();
    },
    showItemsSubScreen: function (subScreen, items, emptyMessage) {
        if (items && subScreen.setup(this._player, items) > 0) {
            this.setSubScreen(subScreen);
        } else {
            Game.sendMessage(this._player, emptyMessage);
            Game.refresh();
        }
    }
};

// Define our winning screen
Game.Screen.winScreen = {
    enter: function () { console.log("Entered win screen."); },
    exit: function () { console.log("Exited win screen."); },
    render: function (display) {
        // Render our prompt to the screen
        for (var i = 0; i < 22; i++) {
            // Generate random background colors
            var r = Math.round(Math.random() * 255);
            var g = Math.round(Math.random() * 255);
            var b = Math.round(Math.random() * 255);
            var background = ROT.Color.toRGB([r, g, b]);
            display.drawText(2, i + 1, "%b{" + background + "}You win!");
        }
    },
    handleInput: function (inputType, inputData) {
        // Nothing to do here      
    }
};

// Define our losing screen
Game.Screen.loseScreen = {
    enter: function () { console.log("Entered lose screen."); },
    exit: function () { console.log("Exited lose screen."); },
    render: function (display) {
        // Render our prompt to the screen
        for (var i = 0; i < 22; i++) {
            display.drawText(2, i + 1, "%b{red}You lose! :(");
        }
    },
    handleInput: function (inputType, inputData) {
        // Nothing to do here      
    }
};

Game.Screen.ItemListScreen = function (template) {
    // Set up based on the template
    this._caption = template['caption'];
    this._okFunction = template['ok'];
    // By default, we use the identity function
    this._isAcceptableFunction = template['isAcceptable'] || function (x) {
        return x;
    }
    // Whether the user can select items at all.
    this._canSelectItem = template['canSelect'];
    // Whether the user can select multiple items.
    this._canSelectMultipleItems = template['canSelectMultipleItems'];
    // Whether a 'no item' option should appear.
    this._hasNoItemOption = template['hasNoItemOption'];
};

Game.Screen.ItemListScreen.prototype.setup = function (player, items) {
    this._player = player;
    // Should be called before switching to the screen.
    var count = 0;
    // Iterate over each item, keeping only the aceptable ones and counting
    // the number of acceptable items.
    var that = this;
    this._items = items.map(function (item) {
        // Transform the item into null if it's not acceptable
        if (that._isAcceptableFunction(item)) {
            count++;
            return item;
        } else {
            return null;
        }
    });
    // Clean set of selected indices
    this._selectedIndices = {};
    return count;
};

Game.Screen.ItemListScreen.prototype.render = function (display) {
    var letters = 'abcdefghijklmnopqrstuvwxyz';
    // Render the caption in the top row
    display.drawText(0, 0, this._caption);
    // Render the no item row if enabled
    if (this._hasNoItemOption) {
        display.drawText(0, 1, '0 - no item');
    }
    var row = 0;
    for (var i = 0; i < this._items.length; i++) {
        wield = this._player.getWielding();
        // If we have an item, we want to render it.
        if (this._items[i]) {
            // Get the letter matching the item's index
            var letter = letters.substring(i, i + 1);
            // If we have selected an item, show a +, else show a dash between
            // the letter and the item's name.
            var selectionState = (this._canSelectItem && this._canSelectMultipleItems &&
                this._selectedIndices[i]) ? '+' : '-';
            // Check if the item is worn or wielded
            var suffix = '';
            if (this._items[i] === this._player.getArmor()) {
                suffix = ' (wearing)';
            } else if (this._items[i] === wield[0]) {
                suffix = ' (1st hand)';
            } else if (this._items[i] === wield[1]) {
                suffix = ' (2nd hand)'
            }



            // Render at the correct row and add 2.
            display.drawText(0, 2 + row, letter + ' ' + selectionState + ' ' +
                this._items[i].describe() + ' (' + this._items[i].getAmount() + ') ' + suffix);
            row++;
        }
    }
};

Game.Screen.ItemListScreen.prototype.executeOkFunction = function () {
    // Gather the selected items.
    var selectedItems = {};
    for (var key in this._selectedIndices) {
        selectedItems[key] = this._items[key];
    }
    // Switch back to the play screen.
    Game.Screen.playScreen.setSubScreen(undefined);
    // Call the OK function and end the player's turn if it return true.
    if (this._okFunction(selectedItems)) {
        this._player.getMap().getEngine().unlock();
    }
};
Game.Screen.ItemListScreen.prototype.handleInput = function (inputType, inputData) {
    if (inputType === 'keydown') {
        // If the user hit escape, hit enter and can't select an item, or hit
        // enter without any items selected, simply cancel out
        if (inputData.keyCode === ROT.VK_ESCAPE ||
            (inputData.keyCode === ROT.VK_RETURN &&
                (!this._canSelectItem || Object.keys(this._selectedIndices).length === 0))) {
            Game.Screen.playScreen.setSubScreen(undefined);
            // Handle pressing return when items are selected

        } else if (inputData.keyCode === ROT.VK_RETURN) {
            this.executeOkFunction();
            // Handle pressing zero when 'no item' selection is enabled
        } else if (this._canSelectItem && this._hasNoItemOption && inputData.keyCode === ROT.VK_0) {
            this._selectedIndices = {};
            this.executeOkFunction();
            // Handle pressing a letter if we can select
        } else if (this._canSelectItem && inputData.keyCode >= ROT.VK_A &&
            inputData.keyCode <= ROT.VK_Z) {
            // Check if it maps to a valid item by subtracting 'a' from the character
            // to know what letter of the alphabet we used.
            var index = inputData.keyCode - ROT.VK_A;
            if (this._items[index]) {
                // If multiple selection is allowed, toggle the selection status, else
                // select the item and exit the screen
                if (this._canSelectMultipleItems) {
                    if (this._selectedIndices[index]) {
                        delete this._selectedIndices[index];
                    } else {
                        this._selectedIndices[index] = true;
                    }
                    // Redraw screen
                    Game.refresh();
                } else {
                    this._selectedIndices[index] = true;
                    this.executeOkFunction();
                }
            }
        }
    }
};

Game.Screen.inventoryScreen = new Game.Screen.ItemListScreen({
    caption: 'Inventory',
    canSelect: false
});

Game.Screen.pickupScreen = new Game.Screen.ItemListScreen({
    caption: 'Choose the items you wish to pickup',
    canSelect: true,
    canSelectMultipleItems: true,

    ok: function (selectedItems) {
        // Try to pick up all items, messaging the player if they couldn't all be
        // picked up.
        if (!this._player.pickupItems(Object.keys(selectedItems))) {
            Game.sendMessage(this._player, "Your inventory is full! Not all items were picked up.");
        }
        return true;
    }
});

Game.Screen.dropScreen = new Game.Screen.ItemListScreen({
    caption: 'Choose the item you wish to drop',
    canSelect: true,
    canSelectMultipleItems: false,
    ok: function (selectedItems) {
        // Drop the selected item
        this._player.dropItem(Object.keys(selectedItems)[0]);
        return true;
    }
});

Game.Screen.eatScreen = new Game.Screen.ItemListScreen({
    caption: 'Choose the item you wish to eat',
    canSelect: true,
    canSelectMultipleItems: false,
    isAcceptable: function (item) {
        return item && item.hasMixin('Edible');
    },
    ok: function (selectedItems) {
        // Eat the item, removing it if there are no consumptions remaining.
        var key = Object.keys(selectedItems)[0];
        var item = selectedItems[key];
        Game.sendMessage(this._player, "You eat %s.", [item.describeThe()]);
        item.eat(this._player);
        if (!item.hasRemainingConsumptions()) {
            this._player.removeItem(key);
        }
        return true;
    }
});

Game.Screen.wieldPrimaryScreen = new Game.Screen.ItemListScreen({
    caption: 'Choose the item you wish to wield in first hand',
    canSelect: true,
    canSelectMultipleItems: false,
    hasNoItemOption: true,
    isAcceptable: function (item) {
        return item && item.hasMixin('Equippable') && item.isWieldable();
    },
    ok: function (selectedItems) {
        // Check if we selected 'no item'
        var keys = Object.keys(selectedItems);
        if (keys.length === 0) {
            item = this._player.getWielding()
            this._player.unwieldPrimary();
            Game.sendMessage(this._player, "You remove %s from first hand.", [item[0].describeA()]);
        } else {
            // Make sure to unequip the item first in case it is the armor.
            var item = selectedItems[keys[0]];
            this._player.unequip(item);
            this._player.wieldPrimary(item);
            Game.sendMessage(this._player, "You are wielding %s in first hand.", [item.describeA()]);
        }
        return true;
    }
});
Game.Screen.wieldSecondaryScreen = new Game.Screen.ItemListScreen({
    caption: 'Choose the item you wish to wield in second hand',
    canSelect: true,
    canSelectMultipleItems: false,
    hasNoItemOption: true,
    isAcceptable: function (item) {
        return item && item.hasMixin('Equippable') && item.isWieldable();
    },
    ok: function (selectedItems) {
        // Check if we selected 'no item'
        var keys = Object.keys(selectedItems);
        if (keys.length === 0) {
            item = this._player.getWielding()
            this._player.unwieldSecondary();
            Game.sendMessage(this._player, "You remove %s from second hand.", [item[1].describeA()])
        } else {
            // Make sure to unequip the item first in case it is the armor.
            var item = selectedItems[keys[0]];
            this._player.unequip(item);
            this._player.wieldSecondary(item);
            Game.sendMessage(this._player, "You are wielding %s in second hand.", [item.describeA()]);
        }
        return true;
    }
});

Game.Screen.wearScreen = new Game.Screen.ItemListScreen({
    caption: 'Choose the item you wish to wear',
    canSelect: true,
    canSelectMultipleItems: false,
    hasNoItemOption: true,
    isAcceptable: function (item) {
        return item && item.hasMixin('Equippable') && item.isWearable();
    },
    ok: function (selectedItems) {
        // Check if we selected 'no item'
        var keys = Object.keys(selectedItems);
        if (keys.length === 0) {
            this._player.unwield();
            Game.sendMessage(this._player, "You are not wearing anthing.")
        } else {
            // Make sure to unequip the item first in case it is the weapon.
            var item = selectedItems[keys[0]];
            this._player.unequip(item);
            this._player.wear(item);
            Game.sendMessage(this._player, "You are wearing %s.", [item.describeA()]);
        }
        return true;
    }
});

Game.Screen.examineScreen = new Game.Screen.ItemListScreen({
    caption: 'Choose the item you wish to examine',
    canSelect: true,
    canSelectMultipleItems: false,
    isAcceptable: function (item) {
        return true;
    },
    ok: function (selectedItems) {
        var keys = Object.keys(selectedItems);
        if (keys.length > 0) {
            var item = selectedItems[keys[0]];
            Game.sendMessage(this._player, "It's %s (%s).",
                [
                    item.describeA(false),
                    item.details()
                ]);
        }
        return true;
    }
});

Game.Screen.gainStatScreen = {
    setup: function (entity) {
        // Must be called before rendering.
        this._entity = entity;
        this._options = entity.getStatOptions();
    },
    render: function (display) {
        var letters = 'abcdefghijklmnopqrstuvwxyz';
        display.drawText(0, 0, 'Choose a stat to increase: ');

        // Iterate through each of our options
        for (var i = 0; i < this._options.length; i++) {
            display.drawText(0, 2 + i,
                letters.substring(i, i + 1) + ' - ' + this._options[i][0]);
        }

        // Render remaining stat points
        display.drawText(0, 4 + this._options.length,
            "Remaining points: " + this._entity.getStatPoints());
    },
    handleInput: function (inputType, inputData) {
        if (inputType === 'keydown') {
            // If a letter was pressed, check if it matches to a valid option.
            if (inputData.keyCode >= ROT.VK_A && inputData.keyCode <= ROT.VK_Z) {
                // Check if it maps to a valid item by subtracting 'a' from the character
                // to know what letter of the alphabet we used.
                var index = inputData.keyCode - ROT.VK_A;
                if (this._options[index]) {
                    // Call the stat increasing function
                    this._options[index][1].call(this._entity);
                    // Decrease stat points
                    this._entity.setStatPoints(this._entity.getStatPoints() - 1);
                    // If we have no stat points left, exit the screen, else refresh
                    if (this._entity.getStatPoints() == 0) {
                        Game.Screen.playScreen.setSubScreen(undefined);
                    } else {
                        Game.refresh();
                    }
                }
            }
        }
    }
};



Game.Screen.DirectionBasedScreen = function (template) {
    template = template || {};
    
    // By default, our ok return does nothing and does not consume a turn.
    this._isAcceptableFunction = template['okFunction'] || function (x, y) {
        return false;
    };
    // The defaut caption function simply returns an empty string.
    this._captionFunction = template['captionFunction'] || function (x, y) {
        return '';
    }
    
};

Game.Screen.DirectionBasedScreen.prototype.setup = function (player) {
    this._player = player;
    var visibleCells = {};
    this._attacking = false;
    
    this._player.getMap().getFov(this._player.getZ()).compute(
        this._player.getX(), this._player.getY(),
        this._player.getSightRadius(),
        function (x, y, radius, visibility) {
            visibleCells[x + "," + y] = true;
        });
    this._visibleCells = visibleCells;
};

Game.Screen.DirectionBasedScreen.prototype.render = function (display) {
    Game.Screen.playScreen.renderTiles.call(Game.Screen.playScreen, display);


    var messages = this._player.getMessages();
    var messageY = 22;
    for (var i = 0; i < messages.length; i++) {
        // Draw each message, adding the number of lines
        messageY += display.drawText(
            0,
            messageY,
            '%c{white}%b{black}' + messages[i]
        );
    }

    var stats = '%c{greenyellow}%b{black}';
    stats += vsprintf('HP: %d/%d L: %d XP: %d',
        [this._player.getHp(), this._player.getMaxHp(),
        this._player.getLevel(), this._player.getExperience()]);
    display.drawText(0, Game.getScreenHeight() + 1, stats);
    // Render hunger state
    var hungerState = '%c{greenyellow}%b{black}';
    hungerState += vsprintf('%s', [this._player.getHungerState()]);
    display.drawText(Game.getScreenWidth() - hungerState.length / 2, Game.getScreenHeight() + 1, hungerState);

};

Game.Screen.DirectionBasedScreen.prototype.handleInput = function (inputType, inputData) {
    // direction the cursor
    if (inputType == 'keydown') {
        if (inputData.keyCode === ROT.VK_LEFT || inputData.keyCode === 100) {
            this.direction(-1, 0);
        } else if (inputData.keyCode === ROT.VK_RIGHT || inputData.keyCode === 102) {
            this.direction(1, 0);
        } else if (inputData.keyCode === ROT.VK_UP || inputData.keyCode === 104) {
            this.direction(0, -1);
        } else if (inputData.keyCode === ROT.VK_DOWN || inputData.keyCode === 98) {
            this.direction(0, 1);
        } else if (inputData.keyCode === 97) {
            this.direction(-1, 1);
        } else if (inputData.keyCode === 99) {
            this.direction(1, 1);
        } else if (inputData.keyCode === 103) {
            this.direction(-1, -1);
        } else if (inputData.keyCode === 105) {
            this.direction(1, -1);
        } else if (inputData.keyCode === ROT.VK_ESCAPE) {
            Game.Screen.playScreen.setSubScreen(undefined);
        } else {return;}
    this.executeOkFunction();
    //Game.refresh();
    }
};


Game.Screen.DirectionBasedScreen.prototype.executeOkFunction = function () {
    // Switch back to the play screen.
    Game.Screen.playScreen.setSubScreen(undefined);
    // Call the OK function and end the player's turn if it return true.
 
        this._player.getMap().getEngine().unlock();
    
};
Game.Screen.directionScreen = new Game.Screen.DirectionBasedScreen({

});

Game.Screen.meleeDirectionScreen = new Game.Screen.DirectionBasedScreen({
 enter: function () {     
     this._attacking = true;
 }
});


Game.Screen.DirectionBasedScreen.prototype.direction = function (x,y) {
    if (!this._attacking) {
      //  this._player.getMap().getEngine().unlock();
       // Game.Screen.playScreen.setSubScreen(undefined);
        this._player.meleeAttack(x,y);
}

    



};










Game.Screen.TargetBasedScreen = function (template) {
    template = template || {};
    // By default, our ok return does nothing and does not consume a turn.
    this._isAcceptableFunction = template['okFunction'] || function (x, y) {
        return false;
    };
    // The defaut caption function simply returns an empty string.
    this._captionFunction = template['captionFunction'] || function (x, y) {
        return '';
    }
};

Game.Screen.TargetBasedScreen.prototype.setup = function (player, startX, startY, offsetX, offsetY) {
    this._player = player;
    this._lineLength = null;
    // Store original position. Subtract the offset to make life easy so we don't
    // always have to remove it.
    this._startX = startX - offsetX;
    this._startY = startY - offsetY;
    // Store current cursor position
    this._cursorX = this._startX;
    this._cursorY = this._startY;
    // Store map offsets
    this._offsetX = offsetX;
    this._offsetY = offsetY;
    // Cache the FOV
    var visibleCells = {};
    this._player.getMap().getFov(this._player.getZ()).compute(
        this._player.getX(), this._player.getY(),
        this._player.getSightRadius(),
        function (x, y, radius, visibility) {
            visibleCells[x + "," + y] = true;
        });
    this._visibleCells = visibleCells;
};

Game.Screen.TargetBasedScreen.prototype.render = function (display) {
    Game.Screen.playScreen.renderTiles.call(Game.Screen.playScreen, display);


    // Render target star
    display.drawText(this._cursorX, this._cursorY, '%c{magenta}*');


    var messages = this._player.getMessages();
    var messageY = 22;
    for (var i = 0; i < messages.length; i++) {
        // Draw each message, adding the number of lines
        messageY += display.drawText(
            0,
            messageY,
            '%c{white}%b{black}' + messages[i]
        );
    }

    var stats = '%c{greenyellow}%b{black}';
    stats += vsprintf('HP: %d/%d L: %d XP: %d',
        [this._player.getHp(), this._player.getMaxHp(),
        this._player.getLevel(), this._player.getExperience()]);
    display.drawText(0, Game.getScreenHeight() + 1, stats);
    // Render hunger state
    var hungerState = '%c{greenyellow}%b{black}';
    hungerState += vsprintf('%s', [this._player.getHungerState()]);
    display.drawText(Game.getScreenWidth() - hungerState.length / 2, Game.getScreenHeight() + 1, hungerState);

    // Render the caption at the bottom.
    display.drawText(0, Game.getScreenHeight() + 3,
        this._captionFunction(this._cursorX + this._offsetX, this._cursorY + this._offsetY));
};

Game.Screen.TargetBasedScreen.prototype.handleInput = function (inputType, inputData) {
    // Move the cursor
    if (inputType == 'keydown') {
        if (inputData.keyCode === ROT.VK_LEFT || inputData.keyCode === 100) {
            this.moveCursor(-1, 0);
        } else if (inputData.keyCode === ROT.VK_RIGHT || inputData.keyCode === 102) {
            this.moveCursor(1, 0);
        } else if (inputData.keyCode === ROT.VK_UP || inputData.keyCode === 104) {
            this.moveCursor(0, -1);
        } else if (inputData.keyCode === ROT.VK_DOWN || inputData.keyCode === 98) {
            this.moveCursor(0, 1);
        } else if (inputData.keyCode === 97) {
            this.moveCursor(-1, 1);
        } else if (inputData.keyCode === 99) {
            this.moveCursor(1, 1);
        } else if (inputData.keyCode === 103) {
            this.moveCursor(-1, -1);
        } else if (inputData.keyCode === 105) {
            this.moveCursor(1, -1);
        } else if (inputData.keyCode === ROT.VK_ESCAPE) {
            Game.Screen.playScreen.setSubScreen(undefined);
        } else if (inputData.keyCode === ROT.VK_RETURN) {
            this.executeOkFunction();
        } else if (inputData.keyCode === ROT.VK_1) {


            var points = Game.Geometry.getLine(this._startX, this._startY, this._cursorX,
                this._cursorY);
            _lineLength = points.length;
            this.missile(points.length);
        }
    }
    Game.refresh();
};

Game.Screen.TargetBasedScreen.prototype.moveCursor = function (dx, dy) {
    // Make sure we stay within bounds.
    this._cursorX = Math.max(0, Math.min(this._cursorX + dx, Game.getScreenWidth()));
    // We have to save the last line for the caption.
    this._cursorY = Math.max(0, Math.min(this._cursorY + dy, Game.getScreenHeight() - 1));
};

Game.Screen.TargetBasedScreen.prototype.executeOkFunction = function () {
    // Switch back to the play screen.
    Game.Screen.playScreen.setSubScreen(undefined);
    // Call the OK function and end the player's turn if it return true.
    if (this._okFunction(this._cursorX + this._offsetX, this._cursorY + this._offsetY)) {
        this._player.getMap().getEngine().unlock();
    }
};
Game.Screen.targetScreen = new Game.Screen.TargetBasedScreen({

});

Game.Screen.lookScreen = new Game.Screen.TargetBasedScreen({
    captionFunction: function (x, y) {
        var z = this._player.getZ();
        var map = this._player.getMap();
        // If the tile is explored, we can give a better capton
        if (map.isExplored(x, y, z)) {
            // If the tile isn't explored, we have to check if we can actually 
            // see it before testing if there's an entity or item.
            if (this._visibleCells[x + ',' + y]) {
                var items = map.getItemsAt(x, y, z);
                // If we have items, we want to render the top most item
                if (items) {
                    var item = items[items.length - 1];
                    return String.format('%s - %s (%s)',
                        item.getRepresentation(),
                        item.describeA(true),
                        item.details());
                    // Else check if there's an entity
                } else if (map.getEntityAt(x, y, z)) {
                    var entity = map.getEntityAt(x, y, z);
                    return String.format('%s ',

                        entity.describeA(true),
                        //    entity.details()
                    );
                }
            }
            // If there was no entity/item or the tile wasn't visible, then use
            // the tile information.
            return String.format('%s - %s',
                map.getTile(x, y, z).getRepresentation(),
                map.getTile(x, y, z).getDescription());

        } else {
            // If the tile is not explored, show the null tile description.
            return String.format('%s - %s',
                Game.Tile.nullTile.getRepresentation(),
                Game.Tile.nullTile.getDescription());
        }
    }
});

Game.Screen.TargetBasedScreen.prototype.missile = function (shotRange) {
    //Get line to the target
    var points = Game.Geometry.getLine(this._startX, this._startY, this._cursorX,
        this._cursorY);

    var entity = null;
    var z = this._player.getZ();
    var map = this._player.getMap();


    // check for collisions between missile and target
    for (var i = 1, l = points.length; i < l; i++) {
        var x = points[i].x + this._offsetX;
        var y = points[i].y + this._offsetY
        // if there's blocking tile, 1/10 change to go past it
        if (map.getTile(x, y, z).isBlockingLight()) {
            console.log("tree");
            var rnd = Math.floor(Math.random() * 10)
            if (rnd != 1) {
                this._player.getMap().getEngine().unlock();
                Game.Screen.playScreen.setSubScreen(undefined);
                return;
            }
        }
        if (map.getEntityAt(x, y, z)) {
            entity = map.getEntityAt(x, y, z);
            break;
        }
    }
    // if no entity, misfire
    if (entity == null) {
        this._player.getMap().getEngine().unlock();
        Game.Screen.playScreen.setSubScreen(undefined);
        return;
    }
    // Switch back to the play screen and shoot the enemy.
    this._player.getMap().getEngine().unlock();
    Game.Screen.playScreen.setSubScreen(undefined);
    this._player.shoot(entity, shotRange);


};

// Define our help screen
Game.Screen.helpScreen = {
    render: function (display) {
        var text = '%c{greenyellow}laakso help';
        var border = '-----------';
        var y = 0;
        display.drawText(Game.getScreenWidth() / 2 - text.length / 2, y++, text);
        display.drawText(Game.getScreenWidth() / 2 - text.length / 2, y++, border);

        y += 3;
        display.drawText(0, y++, '[,] to pick up items');
        display.drawText(0, y++, '[d] to drop items');
        display.drawText(0, y++, '[e] to eat items');
        display.drawText(0, y++, '[w] to wield items');
        display.drawText(0, y++, '[W] to wear items');
        display.drawText(0, y++, '[x] to examine it ems');
        display.drawText(0, y++, '[l] to look around you');
        display.drawText(0, y++, '[m] to mark spot for workers');
        display.drawText(0, y++, '[?] to show this help screen');
        y += 3;
        text = '--- press any key to continue ---';
        display.drawText(Game.getScreenWidth() / 2 - text.length / 2, y++, text);
    },
    handleInput: function (inputType, inputData) {
        Game.Screen.playScreen.setSubScreen(null);
    }
};