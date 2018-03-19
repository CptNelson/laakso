
Game.Map.Realm = function (tiles, player) {
    // Call the Map constructor
    Game.Map.call(this, tiles);


    // this._tiles is reversed [y][x]
    for (x = 0; x < realmMap.length; x++) {
        for (y = 0; y < realmMap[0].length; y++) {
            if (realmMap[x][y] == '#') {
                this._tiles[0][y + 10][x + 10] = Game.Tile.wallTile;
            } else this._tiles[0][y][x] = Game.Tile.floorTile;
        }
    }
    // change some of the wall tiles to tree and wall tiles
    for (x = 0; x < realmMap.length; x++) {
        for (y = 0; y < realmMap[0].length; y++) {
            if (realmMap[x][y] == '#') {
                i = Math.floor(Math.random() * (11))
                if (i > 3) {
                    this._tiles[0][y + 10][x + 10] = Game.Tile.floorTile;
                }
                if (i > 8) {
                    this._tiles[0][y + 10][x + 10] = Game.Tile.treeTile;
                }
            }
        }
    }
    //grow more trees from existing ones. 
    for (times = 0; times < 4; times++) {
        for (x = 0; x < this._tiles[0].length; x++) {
            for (y = 0; y < this._tiles[0][0].length; y++) {
                if (this._tiles[0][y][x] == Game.Tile.treeTile) {
                    i = Math.floor(Math.random() * (4))
                    if (i == 1) {
                        var xOffset = Math.floor(Math.random() * 3) - 1;
                        var yOffset = Math.floor(Math.random() * 3) - 1;
                        if (xOffset != 0 || yOffset != 0) {

                              this._tiles[0][y + xOffset][x + yOffset] = Game.Tile.treeTile;
                        }
                    }
                }

            }
        }
    }

    for (x = 0; x < this._tiles[0][0].length; x++) {
        for (y = 0; y < this._tiles[0].length; y++) {
            i = Math.floor(Math.random() * (25))
            if (i == 8) {
                  this._tiles[0][y][x] = Game.Tile.yellowTreeTile;
            }
            if (i == 9) {
                 this._tiles[0][y][x] = Game.Tile.treeTile;
            }
            if (this._tiles[0][y][x] == Game.Tile.floorTile) {
                b = Math.floor(Math.random() * (6))
                if (b == 1) {
                    this._tiles[0][y][x] = Game.Tile.yellowBushTile;    
                }           
            }
        }
    }





};
Game.Map.Realm.extend(Game.Map);
