Game.Tile = function(properties) {
    properties = properties || {};
    // Call the Glyph constructor with our properties
    Game.Glyph.call(this, properties);
    // Set up the properties. We use false by default.
    this._hitpoints = properties['hitpoints'] || 100;
    this._size = properties['size'] || 10;
    this._walkable = properties['walkable'] || false;
    this._diggable = properties['diggable'] || false;
    this._blocksLight = (properties['blocksLight'] !== undefined) ?
        properties['blocksLight'] : true;
    this._description = properties['description'] || '';    
};
// Make tiles inherit all the functionality from glyphs
Game.Tile.extend(Game.Glyph);

// Standard getters
Game.Tile.prototype.isWalkable = function() {
    return this._walkable;
};
Game.Tile.prototype.isDiggable = function() {
    return this._diggable;
};
Game.Tile.prototype.isBlockingLight = function() {
    return this._blocksLight;
};
Game.Tile.prototype.getDescription = function() {
    return this._description;
};
Game.Tile.prototype.getHitpoints= function() {
    return this._hitpoints;
};
Game.Tile.prototype.setHitpoints = function(amount) {
    this._hitpoints -= amount;
}
Game.Tile.prototype.getSize = function() {
    return this._size;
};

Game.Tile.nullTile = new Game.Tile({description: '(unknown)'});
Game.Tile.floorTile = new Game.Tile({
    character: '.',
    walkable: true,
    blocksLight: false,
    description: 'Some dirt and plants and shit'
});
Game.Tile.groundTile = new Game.Tile({
    character: '.',
    foreground: 'brown',
    walkable: true,
    blocksLight: false,
    description: 'Some dirt and plants and shit'
});

Game.Tile.wallTile = new Game.Tile({
    character: '#',
    foreground: 'goldenrod',
    description: 'A cave wall'
});
Game.Tile.stairsUpTile = new Game.Tile({
    character: '<',
    foreground: 'white',
    walkable: true,
    blocksLight: false,
    description: 'A rock staircase leading upwards'
});
Game.Tile.stairsDownTile = new Game.Tile({
    character: '>',
    foreground: 'white',
    walkable: true,
    blocksLight: false,
    description: 'A rock staircase leading downwards'
});
Game.Tile.construction = new Game.Tile({
    character: '¤',
    foreground: 'goldenrod',
    walkable: false,
    blocksLight: false,
    description: 'A piece of wall is being build here'
});
Game.Tile.treeTile = new Game.Tile({
    character: '▲',
    foreground: 'green',
    walkable: false,
    blocksLight: true,
    description: 'A pine tree',
    hitpoints: 50
});
Game.Tile.yellowTreeTile = new Game.Tile({
    character: '▲',
    foreground: 'yellowgreen',
    walkable: false,
    blocksLight: false,
    description: 'A small pine tree'
});
Game.Tile.yellowBushTile = new Game.Tile({
    character: ',',
    foreground: 'yellowgreen',
    walkable: true,
    blocksLight: false,
    description: 'small bush'
});

// Helper function
Game.getNeighborPositions = function(x, y) {
    var tiles = [];
    // Generate all possible offsets
    for (var dX = -1; dX < 2; dX ++) {
        for (var dY = -1; dY < 2; dY++) {
            // Make sure it isn't the same tile
            if (dX == 0 && dY == 0) {
                continue;
            }
            tiles.push({x: x + dX, y: y + dY});
        }
    }
    return tiles.randomize();
};