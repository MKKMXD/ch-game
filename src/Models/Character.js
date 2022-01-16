import Phaser from "phaser"

export const CHARACTER_STATES = {
    WALK: "WALK",
    FIGHT: "FIGHT",
    STUN: "STUN",
    DEATH: "DEATH",
    WAIT: "WAIT"
}
export default class Character extends Phaser.GameObjects.Container
{
    constructor(scene, x, y, type, name)
    {
        super(scene);
        this.scene = scene;
        this.name = "character";
        this.model = null;
        this.hp = 100;
        this.mp = 100;
        this.maxHp = 100;
        this.maxMp = 100;
        this.hpText = null;
        this.mpText = null;
        this.statusAlive = true;
        this.currentState = CHARACTER_STATES.WAIT
        this.totalDamaged = 0;

        this.widthMap = 30;
        this.heightMap = 30;

        this.targetPoint = null;
        this.isMove = true;
        this.int = 10;
        this.str = 10;
        this.agl = 10;

        this.level = 1;
        this.hpRegen = 1;

        this.team = null;

        this.modelFile = '';
        this.modelFileWalkSpriteSheet = '';
        this.modelFileFightSpriteSheet = '';
        this.spells = [];
        this.effects = {};//up //down, as migration
        this.modifiersAttack = {};//up //down, as migration
        this.currentPath = [];

        this.pathBlockCounter = 2;
        this.frameWaitWidth = 26;
        switch (type) {
            case 'tank': 
                this.modelFile = 'src/assets/Models/Characters/Tank.png';
                this.modelFileWalkSpriteSheet = 'src/assets/Models/Characters/Move/TankSpritesheet.png'
            break;
            case 'mage':
                this.modelFile = 'src/assets/Models/Characters/Mage.png';
                this.modelFileWalkSpriteSheet = 'src/assets/Models/Characters/Move/MageSpritesheet.png'
                break
            case 'killer':
                this.modelFile = 'src/assets/Models/Characters/Killer.png';
                this.modelFileWalkSpriteSheet = 'src/assets/Models/Characters/Move/KillerSpritesheet.png'
                this.modelFileFightSpriteSheet = 'src/assets/Models/Characters/Fight/KillerFight.png';
                break;
            case 'wave1':
                this.modelFile = 'src/assets/Models/Characters/Killer.png';
                break;
            case 'wave1_boss':
                this.modelFile = 'src/assets/Models/Characters/Killer.png';
                break;
            default:
                this.modelFile = 'src/assets/Models/Characters/Character.png';
                this.modelFileWalkSpriteSheet = 'src/assets/Models/Characters/Move/DefaultSpritesheet.png'
                this.frameWaitWidth = 19
        }

        this.selectFile = 'src/assets/select.png';
        this.damageEffectFile = 'src/assets/damageEffect.png';

        this.name = this.name + "_" + type;

        if (name) {
            this.name = name;
        }

        if (type == "mage") {
            this.setInt(30);
        }

        if (type == "tank") {
            this.setHealth(300)
        }

        if (type == "killer") {
            this.setStr(30);
            this.setHealth(500)
        }

        this.uid = this.generateUUID();

        this.load();
    }

    setMapSize = (width, height) => {
        this.widthMap = width;
        this.heightMap = height;
    }

    getMapSize = () => {
        return {
            width: this.widthMap, 
            height: this.heightMap
        }
    }

    setPath = (val) => {
        if (val) {
            val.shift();
            this.currentPath = val
        }
    }
    
    getPath = () => {
        return this.currentPath
    }

    getPathPosition = () => {
        return this.currentPath.shift();
    }

    subPathBlockCounter = () => {
        this.pathBlockCounter--;
        if (this.pathBlockCounter < 0) this.pathBlockCounter = 0;
    }

    resetPathBlockCounter = () => {
        this.pathBlockCounter = 2;
    }

    getPathBlockCounter = () => {
        return this.pathBlockCounter;
    }

    getTargetPathPosition = () => {
        if (this.currentPath) {
            let obj = this.currentPath[this.currentPath.length - 1];
            return obj;
        }
        return null;
    }

    addEffect = (effect) => {
        if (!this.effects[effect.name]) {
            this.effects[effect.name] = effect;
            effect.up(this);
            return true;
        }

        return false;
    }

    removeEffect = (effect) => {
        try {
            let currentEffect = this.effects[effect.name];
            if (currentEffect) {
                currentEffect.down(this);
                this.effects[effect.name] = null;
            }   
        } catch (e) {
            //Do nothing
        }
    }

    addModifierAttack = (modify) => {
        this.modifiersAttack[modify.name] = modify;
    }

    removeModifierAttack = (modifier) => {
        try {
            let modifierAttack = this.modifiersAttack[modifier.name];
            if (modifierAttack) {
                this.effects[modifierAttack.name] = null;
            }   
        } catch (e) {
            //Do nothing
        }
    }

    /**
     * Regen, effects
     */
    lifeCycle = () => {
        this.regeneration();
    }

    moveTo = () => {
        if (this.currentPath && this.currentPath.length) {
            let pos = this.getPathPosition();
            this.setPosition(pos.y * this.heightMap, pos.x * this.widthMap);
        }
    }

    setTargetAttack = (character) => {
        this.setState(CHARACTER_STATES.FIGHT)
        this.targetAttack = character;
    }

    getTargetAttack = () => {
        if (this.targetAttack && !this.targetAttack.getAliveStatus()) {
            this.targetAttack = null;
        } 
        
        return this.targetAttack;
    }

    setTargetPoint = (character) => {
        this.targetPoint = {
            x: character.x,
            y: character.y
        }

        this.currentPath = null;
    }

    getTargetPoint = () => {
        return this.targetPoint;
    }

    getTargetMove = (area) => {
        let matrixFind = [
            [-1, -1],
            [-1, 0],
            [-1, 1],
            [1, 0],
            [0, 1],
            [1, 1],
            [1, 0],
            [1, -1],
            [0, -1],
        ]

        let point = null
        if (this.targetPoint) {
            let targetPointCeil = {
                x: Math.ceil(this.targetPoint.x / this.widthMap),
                y: Math.ceil(this.targetPoint.y / this.heightMap),
            }

            for (let i = 0; i < matrixFind.length; i++) {
                let checkPoint = {
                    x: targetPointCeil.x + matrixFind[i][0],
                    y: targetPointCeil.y + matrixFind[i][1]
                }
                if (area[checkPoint.x]) {
                    if (area[checkPoint.x][checkPoint.y] === 0) {
                        point = {
                            x: checkPoint.x * this.widthMap,
                            y: checkPoint.y * this.heightMap
                        }
                        break;
                    }
                }
            }   
        }

        this.targetPoint = null; 
        return point;
    }

    regeneration = () => {
        let hp = this.getHpRegen();
        this.addHealth(hp);
    }

    setTeam = (val) => {
        this.team = val;
    }

    getTeam = () => {
        return this.team;
    }
    
    setName = (name) => {
        this.name = name;
    }
    
    getName = () => {
        return this.name;
    }

    load = () => {
        this.model = this.scene.load.image(this.name, this.modelFile);
        this.scene.load.image("select", this.selectFile);
        this.scene.load.image("damage_effect", this.damageEffectFile);

        this.scene.load.spritesheet(this.name + 'wait', this.modelFile, { frameWidth: this.frameWaitWidth, frameHeight: 30 });

        if (this.modelFileWalkSpriteSheet) {
            this.scene.load.spritesheet(this.name + 'walk', this.modelFileWalkSpriteSheet, { frameWidth: 32, frameHeight: 32 });
        }

        if (this.modelFileFightSpriteSheet) {
            this.scene.load.spritesheet(this.name + 'fight', this.modelFileFightSpriteSheet, { frameWidth: 42, frameHeight: 32 });
        }
        

        if (this.team != 1) {
            this.model.flipX = true;
        } 
        console.log(this.model);
    }

    setPositionLegacy(x, y)
    {
        this.model.x = x;
        this.model.y = y;
        this.hpText = this.scene.add.text(x + 10, y - this.model.height, this.hp, { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' });
        this.mpText = this.scene.add.text(x + 10, y - this.model.height + 15, this.mp, { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif', color: '#55aaFF' });
        this.regenHpText = this.scene.add.text(x + 35, y - this.model.height, "+" + this.getHpRegen(), { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif', color: '#00FF00', fontSize: '10px'});
        this.add(this.hpText);
        this.add(this.mpText);
        this.add(this.regenHpText);
    }

    getPosition = () => {
        let x, y;
        
        return {x: this.x, y: this.y};
    }

    getAliveStatus = () => {
        return this.statusAlive;
    }

    getModel = () => {
        this.model = this.scene.add.sprite(0, 0, this.name);
        this.selectBox = this.scene.add.sprite(0, 0, "select");
        this.damageEffect = this.scene.add.sprite(0, 0, "damage_effect");


        this.scene.anims.create({
            key: this.name + 'wait',
            frames: this.scene.anims.generateFrameNumbers(this.name + 'wait', { frames: [ 0 ] }),
            frameRate: 8,
            repeat: -1
        });

        if (this.modelFileWalkSpriteSheet) {
            this.scene.anims.create({
                key: this.name + 'walk',
                frames: this.scene.anims.generateFrameNumbers(this.name + 'walk', { frames: [ 0, 1, 2 ] }),
                frameRate: 8,
                repeat: -1
            });
        }

        if (this.modelFileFightSpriteSheet) {
            this.scene.anims.create({
                key: this.name + 'fight',
                frames: this.scene.anims.generateFrameNumbers(this.name + 'fight', { frames: [ 0, 1, 2 ] }),
                frameRate: 100,
                repeat: -1
            });
        }
        
        this.addAt(this.model, 2);
        this.addAt(this.selectBox, 2);
        this.addAt(this.damageEffect, 3);
        this.selectBox.visible = false;
        //this.damageEffect.visible = false;
        this.model.parentClass = this;
        return this.model;
    }

    update = () => {
        this.clearEffects();
        let newX = Math.round(Math.random() * 500 - 50);
        let newY = Math.round(Math.random() * 5 + 100 - 50);

        if (this.hpText) {
            this.hpText.text = this.hp;
        }

        if (this.mpText) {
            this.mpText.text = this.mp;
        }

        if (this.regenHpText) {
            this.regenHpText.text = "+" + this.getHpRegen();
        }

        if (this.currentState == CHARACTER_STATES.WALK) {
            if (!this.currentAnimation || this.currentAnimation != "walk") {
                this.currentAnimation = 'walk'
                this.runAnimation(this.name + 'walk');
            }
        } else if (this.currentState == CHARACTER_STATES.WAIT) {
            this.currentAnimation = 'wait'
            this.runAnimation(this.name + 'wait');
        } else if (this.currentState == CHARACTER_STATES.FIGHT) {
            if (this.modelFileFightSpriteSheet && this.currentAnimation != "fight") {
                this.currentAnimation = 'fight'
                this.runAnimation(this.name + 'fight');
            }
        }
    }

    stopAnimation = () => {
        if (this.model) {
            this.model.stop();
        }
    }

    runAnimation = (name) => {
        if (this.model) {
            this.model.play(name);
        }
    }

    getState = () => {
        console.log('getState');
        return this.currentState
    }

    setState = (state) => {
        if (Object.hasOwnProperty.call(CHARACTER_STATES, state)) {
            this.currentState = CHARACTER_STATES[state];
        }
    }

    attack = () => {
        if(this.currentState == CHARACTER_STATES.FIGHT) {
            let attack = Math.round(Math.random() * this.str + 2);
            for (const key in this.modifiersAttack) {
                if (Object.hasOwnProperty.call(this.modifiersAttack, key)) {
                    const element = this.modifiersAttack[key];
                    attack = element.modify(attack);
                }
            }
            if (this.statusAlive) {
                return attack;
            }
            return 0;
        }
    }

    /**
     * 
     * @param {Character} unit 
     * 
     * @returns Number
     */
    checkAttackRange = (unit) => {
        let range = Phaser.Math.Distance.Between(this.x, this.y, unit.x, unit.y); 
        return range;
    }

    getMaxHealth = () => {
        return this.maxHp
    }

    setMaxHealth = (val) => {
        this.maxHp = val;
        return this.maxHp
    }

    getHealth = () => {
        return this.hp;
    }

    getMaxMana = () => {
        return this.maxMp
    }

    getMana = () => {
        return this.mp;
    }

    addHealth = (val) => {
        if (this.statusAlive) {
            this.hp += val;
            if (this.getMaxHealth() < this.hp) {
                this.hp = this.getMaxHealth();
            }
        }

        return this.hp;
    }

    setHealth = (val) => {
        if (this.statusAlive) {
            this.hp = val;
            if (this.getMaxHealth() < this.hp) {
                this.setMaxHealth(this.hp);
                this.hp = this.getMaxHealth();
            }
        }

        return this.hp;
    }

    setHpRegen = (val) => {
        this.hpRegen = val;
        return this.hpRegen;
    }

    getHpRegen = () => {
        return this.hpRegen;
    }

    subtractMana = (val) => {
        if (this.statusAlive) {
            this.mp -= val;
            if (this.mp < 0) {
                this.mp = 0;
            }
        }
        return this.mp;
    }

    setMana = (val) => {
        if (this.statusAlive) {
            this.mp = val;
            if (this.getMaxMana() < this.mp) {
                this.mp = this.getMaxMana();
            }
        }
        return this.mp;
    }

    setDamage = (damage) => {
        this.damageEffect.visible = true;
        if (this.statusAlive) {
            this.totalDamaged += damage;
            this.hp -= damage;
        }
        
        if (this.hp <= 0) {
            console.log("IS DEAD", this.getName())
            this.hp = 0;
            this.statusAlive = false;
        }

        //console.log(this.getName(), " -> GET TOTAL DMG ->", this.totalDamaged);
    }
    
    addSpells = (spell) => {
        spell.setCaster(this);
        spell.setName(spell.name + this.spells.length);
        this.spells.push(spell);
    }

    getActiveSpells = () => {
        return this.spells;
    }

    getUid = () => {
        return this.uid
    }

    generateUUID() {
        var dt = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = (dt + Math.random()*16)%16 | 0;
            dt = Math.floor(dt/16);
            return (c=='x' ? r :(r&0x3|0x8)).toString(16);
        });
        return uuid;
    }

    clearEffects = () => {
        this.damageEffect.visible = false;
    }

    removeObject = () => {
        if (this.model) {
            this.model.removeInteractive();
            this.model.destroy();
            this.hpText.destroy();
            this.mpText.destroy();
            this.regenHpText.destroy();
            this.hpText = null;
            this.mpText = null;
            this.regenHpText = null;
            this.model = null;
        }
    }

    getSpells = () => {
        return this.spells
    }

    iteract = () => {
        this.selectBox.visible = true;
    }

    unIteract = () => {
        this.selectBox.visible = false;
    }

    /** 
     * Stat power 
     */
    setInt = (val) => {
        this.int = val;
        let procMp = this.mp * 100 / this.maxMp;
        this.maxMp = this.int * 10;
        this.mp = this.maxMp * procMp / 100;

        return this.int;
    }

    getInt = () => {
        return this.int;
    }

    getIntPower = () => {
        return this.getInt() * 10 / 100;
    }

    setStr = (val) => {
        this.str = val;

        return this.str;
    }

    getStr = () => {
        return this.str;
    }

    getStrPower = () => {
        return this.getStr() * 10 / 100;
    }
}