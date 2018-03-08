// Constructor for ruined village

Game.Map.Village = function (tiles, player) {
    // Call the Map constructor
    Game.Map.call(this, tiles);
    // Add the player


    var villageMap = [['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
    ['.', '#', '#', '#', '#', '#', '#', '#', '#', '#', '☼', '☼', '☼', '☼', '#', '#', '#', '#', '#', '#', '.', '.', '.', '#', '#', '#', '#', '#', '#', '.', '.', '.', '.', '.', '#', '#', '#', '#', '#', '.'],
    ['.', '#', '.', '.', '.', '.', '.', '.', '.', '#', '☼', '☼', '☼', '.', '■', '.', '.', '.', '.', '#', '.', '.', '.', '#', '.', '.', '.', '.', '#', '.', '.', '▲', '.', '.', '#', '.', '.', '.', '#', '.'],
    ['.', '#', '.', '.', '.', '.', '.', '.', '.', '#', '☼', '☼', '☼', '☼', '#', '.', '.', '.', '.', '#', '.', '.', '.', '#', '.', '.', '.', '.', '#', '.', '.', '.', '.', '.', '#', '.', '.', '.', '#', '.'],
    ['.', '#', '.', '.', '.', '.', '.', '.', '.', '#', '☼', '☼', '☼', '☼', '#', '.', '.', '.', '.', '#', '.', '.', '.', '#', '.', '.', '.', '.', '#', '.', '.', '.', '.', '.', '#', '.', '.', '.', '#', '.'],
    ['.', '#', '.', '#', '#', '.', '.', '.', '.', '#', '.', '.', '#', '#', '#', '.', '.', '.', '.', '#', '.', '.', '.', '■', '.', '.', '.', '.', '#', '.', '.', '.', '.', '.', '#', '.', '.', '.', '#', '.'],
    ['.', '#', '.', '.', '#', '.', '.', '.', '.', '#', '.', '.', '#', '.', '.', '.', '.', '.', '.', '#', '.', '.', '.', '#', '#', '#', '#', '#', '#', '.', '.', '.', '.', '.', '■', '.', '.', '.', '#', '.'],
    ['.', '#', '.', '.', '#', '.', '.', '.', '.', '#', '.', '.', '#', '.', '.', '.', '.', '.', '.', '#', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '#', '.', '.', '.', '#', '.'],
    ['.', '#', '.', '.', '#', '.', '.', '.', '.', '#', '.', '.', '#', '.', '.', '.', '.', '.', '.', '#', '.', '.', '.', '.', '.', '#', '#', '#', '#', '#', '#', '#', '.', '.', '#', '.', '.', '.', '#', '.'],
    ['.', '#', '#', '#', '#', '■', '#', '#', '#', '#', '.', '.', '#', '#', '#', '#', '■', '#', '#', '#', '.', '.', '.', '.', '.', '#', '.', '.', '.', '.', '.', '#', '.', '.', '#', '#', '#', '#', '#', '.'],
    ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '#', '.', '#', '.', '.', '.', '.', '.', '.', '.', '#', '.', '.', '.', '.', '.', '#', '.', '.', '.', '.', '.', '.', '.', '.'],
    ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '#', '.', '.', '.', '.', '.', '#', '.', '.', '.', '.', '.', '.', '.', '.'],
    ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '■', '.', '.', '.', '.', '.', '#', '.', '.', '.', '.', '.', '.', '▲', '.'],
    ['.', '.', '▲', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '#', '.', '.', '.', '.', '.', '#', '.', '.', '.', '.', '.', '.', '.', '.'],
    ['.', '▲', '.', '▲', '.', '#', '#', '#', '#', '■', '■', '#', '#', '#', '#', '.', '.', '.', '.', '#', '#', '#', '#', '#', '#', '#', '.', '.', '.', '.', '.', '#', '.', '.', '#', '■', '#', '#', '#', '.'],
    ['.', '.', '.', '.', '.', '#', '.', '.', '.', '.', '.', '.', '.', '.', '#', '.', '.', '.', '.', '#', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '#', '.', '.', '#', '.', '.', '.', '#', '.'],
    ['.', '.', '.', '.', '.', '#', '.', '.', '.', '.', '.', '.', '.', '.', '#', '.', '.', '.', '.', '#', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '#', '.', '.', '#', '.', '.', '.', '#', '.'],
    ['.', '.', '.', '.', '.', '#', '.', '.', '.', '.', '.', '.', '.', '.', '#', '.', '.', '▲', '.', '#', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '#', '.', '.', '#', '.', '.', '.', '#', '.'],
    ['.', '.', '.', '.', '.', '#', '.', '.', '.', '.', '.', '.', '.', '.', '#', '.', '.', '.', '.', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '.', '.', '#', '#', '#', '#', '#', '.'],
    ['.', '.', '.', '.', '.', '#', '.', '.', '.', '.', '.', '.', '.', '.', '#', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.']];

    // this._tiles is reversed [y][x]
    for (x = 0; x < villageMap.length; x++) {
        for (y = 0; y < villageMap[0].length; y++) {
            if (villageMap[x][y] == '#') {
                this._tiles[0][y][x] = Game.Tile.wallTile;
            } else this._tiles[0][y][x] = Game.Tile.floorTile;
        }
    }

    for (x = 0; x < villageMap.length; x++) {
        for (y = 0; y < villageMap[0].length; y++) {
            if (villageMap[x][y] == '#') {
                i = Math.floor(Math.random() * (11))
                if (i > 2) {
                    this._tiles[0][y][x] = Game.Tile.floorTile;
                }
            }
        }
    }

    this.addEntityAtRandomPosition(player, 0);
    for (i = 0; i < 4; i++) {
        var entity = Game.EntityRepository.createRandom();
        entity._name = Game.NameGenerator();       
        this.addEntityAtRandomPosition(entity, 0);
    }

};
Game.Map.Village.extend(Game.Map);
