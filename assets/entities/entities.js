// Player template
Game.PlayerTemplate = {
    name: Game.NameGenerator()+'(you)',
    character: '@',
    foreground: 'white',
    maxHp: 40,
    attackValue: 10,
    sightRadius: 18,
    inventorySlots: 22,
    mixins: [Game.EntityMixins.PlayerAI,
             Game.EntityMixins.Attacker, Game.EntityMixins.Destructible,
             Game.EntityMixins.InventoryHolder, Game.EntityMixins.FoodConsumer,
             Game.EntityMixins.Sight, Game.EntityMixins.MessageRecipient,
             Game.EntityMixins.Equipper,
             Game.EntityMixins.ExperienceGainer, Game.EntityMixins.PlayerStatGainer]
};

// Create our central entity repository
Game.EntityRepository = new Game.Repository('entities', Game.Entity);



Game.EntityRepository.define('villager', {
    name: 'villager',
    character: 'H',
    foreground: 'white',
    maxHp: 10,
    attackValue: 4,
    //speed: 1000,
    mixins: [Game.EntityMixins.VillagerAI,
             Game.EntityMixins.Attacker, Game.EntityMixins.Destructible,
             Game.EntityMixins.CorpseDropper,
             Game.EntityMixins.ExperienceGainer, Game.EntityMixins.RandomStatGainer]
});

Game.EntityRepository.define('construct', {
    name: 'construct',
    character: '¤',
    foreground: 'goldenrod',
    mixins: [Game.EntityMixins.Prop]
},{
    disableRandomCreation: true
});
