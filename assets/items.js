Game.ItemRepository = new Game.Repository('items', Game.Item);

//======FOOD======

Game.ItemRepository.define('apple', {
    name: 'apple',
    character: '%',
    foreground: 'red',
    foodValue: 40,
    mixins: [Game.ItemMixins.Edible]
});

Game.ItemRepository.define('mushroom', {
    name: 'mushroom',
    character: '%',
    foreground: 'lightBrown',
    foodValue: 15,
    consumptions: 1,
    mixins: [Game.ItemMixins.Edible]
});

Game.ItemRepository.define('bread', {
    name: 'bread',
    character: '%',
    foreground: 'brown',
    foodValue: 30,
    consumptions: 3,
    mixins: [Game.ItemMixins.Edible]
});

Game.ItemRepository.define('corpse', {
    name: 'corpse',
    character: '%',
    foodValue: 75,
    consumptions: 4,
    mixins: [Game.ItemMixins.Edible]
}, {
    disableRandomCreation: true
});

// ======MATERIALS========

Game.ItemRepository.define('rock', {
    name: 'rock',
    character: '*',
    foreground: 'white'
});

Game.ItemRepository.define('wood', {
    name: 'wood',
    character: '|',
    foreground: 'brown'
});

// ======WEAPONS=========


Game.ItemRepository.define('dagger', {
    name: 'dagger',
    character: ')',
    foreground: 'gray',
    attackValue: 5,
    wieldable: true,
    mixins: [Game.ItemMixins.Equippable]
}, {
    disableRandomCreation: false
});
Game.ItemRepository.define('axe', {
    name: 'axe',
    character: ')',
    foreground: 'gray',
    attackValue: Math.floor(Math.random() * 5) + 5,
    wieldable: true,
    mixins: [Game.ItemMixins.Equippable]
}, {
    disableRandomCreation: false
});

Game.ItemRepository.define('sword', {
    name: 'sword',
    character: ')',
    foreground: 'white',
    attackValue: Math.floor(Math.random() * 3),
    defenceValue: Math.floor(Math.random() * 3) + 1,
    damageValue: Math.floor(Math.random() * 3) + 7,
    wieldable: true,
    mixins: [Game.ItemMixins.Equippable]
}, {
    disableRandomCreation: true
});

Game.ItemRepository.define('staff', {
    name: 'staff',
    character: ')',
    foreground: 'yellow',
    attackValue: 5,
    defenseValue: 3,
    wieldable: true,
    mixins: [Game.ItemMixins.Equippable]
}, {
    disableRandomCreation: false
});

Game.ItemRepository.define('shortbow', {
    name: 'shortbow',
    character: ')',
    foreground: 'brown',
    archeryValue: 5,
    missileDamageValue: Math.floor(Math.random() * 2) + 2,
    range: 10,
    wieldable: true,
    mixins: [Game.ItemMixins.Equippable, Game.ItemMixins.Bow]
}, {
    disableRandomCreation: false
});

Game.ItemRepository.define('quiver of arrows', {
    name: 'quiver of arrows',
    character: '/',
    foreground: 'brown',
    attackValue: 0,
    missileDamageValue: Math.floor(Math.random() * 2),
    wieldable: true,
    amount: 20,
    mixins: [Game.ItemMixins.Equippable, Game.ItemMixins.Missile]
}, {
    disableRandomCreation: false
});

// ======WEARABLES========
Game.ItemRepository.define('good tunic', {
    name: 'tunic',
    character: '[',
    foreground: 'green',
    defenseValue: 1,
    wearable: true,
    mixins: [Game.ItemMixins.Equippable]
}, {
    disableRandomCreation: false
})
Game.ItemRepository.define('leather tunic', {
    name: 'leather tunic',
    character: '[',
    foreground: 'lightBrown',
    defenseValue: 2,
    wearable: true,
    mixins: [Game.ItemMixins.Equippable]
}, {
    disableRandomCreation: false
});;

Game.ItemRepository.define('chainmail', {
    name: 'chainmail',
    character: '[',
    foreground: 'white',
    defenseValue: 4,
    wearable: true,
    mixins: [Game.ItemMixins.Equippable]
}, {
    disableRandomCreation: true
});

