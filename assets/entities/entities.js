// Player template
Game.PlayerTemplate = {
    name: Game.NameGenerator()+'(you)',
    character: '@',
    foreground: 'white',
    maxHp: 40,
    attackValue: 35,
    archeryValue: 30,
    sightRadius: 16,
    inventorySlots: 6,
    mixins: [Game.EntityMixins.PlayerAI, Game.EntityMixins.Archer,
             Game.EntityMixins.MeleeAttacker, Game.EntityMixins.Destructible,
             Game.EntityMixins.InventoryHolder, Game.EntityMixins.FoodConsumer,
             Game.EntityMixins.Sight, Game.EntityMixins.MessageRecipient,
             Game.EntityMixins.Equipper, Game.EntityMixins.Human,
             Game.EntityMixins.ExperienceGainer, Game.EntityMixins.PlayerStatGainer]
};

// Create our central entity repository
Game.EntityRepository = new Game.Repository('entities', Game.Entity);



Game.EntityRepository.define('villager', {
    name: 'villager',
    character: 'H',
    foreground: 'white',
    maxHp: 10,
    attackValue: 10,
    //speed: 1000,
    mixins: [Game.EntityMixins.VillagerAI, Game.EntityMixins.Carpenter,
             Game.EntityMixins.MeleeAttacker, Game.EntityMixins.Destructible,
             Game.EntityMixins.CorpseDropper, Game.EntityMixins.Sight, 
             Game.EntityMixins.Human, Game.EntityMixins.Archer, Game.EntityMixins.Equipper,
             Game.EntityMixins.ExperienceGainer, Game.EntityMixins.RandomStatGainer]
});

Game.EntityRepository.define('maahinen', {
    name: 'maahinen',
    character: 'm',
    foreground: 'brown',
    maxHp: 13,
    sightRadius: 18,
    attackValue: 5,
    //speed: 1000,
    mixins: [Game.EntityMixins.MaahinenAI, Game.EntityMixins.Destructible,
             Game.EntityMixins.ExperienceGainer, Game.EntityMixins.RandomStatGainer,
             Game.EntityMixins.MeleeAttacker, Game.EntityMixins.Sight]
});

Game.EntityRepository.define('construct', {
    name: 'construct',
    character: '¤',
    foreground: 'goldenrod',
    maxProgress: 1000,
    progress: 1,
    mixins: [Game.EntityMixins.Buildable, Game.EntityMixins.Prop]
},{
    disableRandomCreation: true
});
