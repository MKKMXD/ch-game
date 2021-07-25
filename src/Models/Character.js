export default class Character
{
    constructor(scene, x, y, type)
    {
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

        this.totalDamaged = 0;

        this.int = 10;
        this.str = 10;
        this.agl = 10;

        this.team = null;

        this.modelFile = '';
        this.spells = [];
        this.effects = [];//up //down, as migration

        switch (type) {
            case 'tank': 
                this.modelFile = 'src/assets/Models/Characters/Tank.png';
            break;
            case 'mage':
                this.modelFile = 'src/assets/Models/Characters/Mage.png';
                break
            case 'killer':
                this.modelFile = 'src/assets/Models/Characters/Killer.png';
                break;
            case 'wave1':
                this.modelFile = 'src/assets/Models/Characters/Killer.png';
                break;
            case 'wave1_boss':
                this.modelFile = 'src/assets/Models/Characters/Killer.png';
                break;
            default:
                this.modelFile = 'src/assets/Models/Characters/Character.png';
        }

        this.name = this.name + "_" + type;

        if (type == "mage") {
            this.setInt(30);
        }

        if (type == "tank") {
            this.setHealth(300)
        }

        if (type == "killer") {
            this.setStr(30);
        }

        this.uid = this.generateUUID();
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

    load()
    {
        this.model = this.scene.load.image(this.name, this.modelFile);
        if (this.team != 1) {
            this.model.flipX = true;
        }
        
    }

    setPosition(x, y)
    {
        this.model.x = x;
        this.model.y = y;
        this.hpText = this.scene.add.text(x + 10, y - this.model.height, this.hp, { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' });
        this.mpText = this.scene.add.text(x + 10, y - this.model.height + 15, this.mp, { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' });
    }

    getPosition()
    {
        let x, y;
        if (this.model) {
            x = this.model.x;
            y = this.model.y;
            return {x, y};
        }
        
        return {x: 0, y: 0};
    }

    getAliveStatus = () => {
        return this.statusAlive;
    }

    getModel()
    {
        this.model = this.scene.add.sprite(0, 0, this.name);
        let newX = Math.round(Math.random()*500 - 50);
        let newY = Math.round(Math.random()*5+100 - 50);
        this.model.x = newX;
        this.model.y = newY;
        return this.model;
    }

    update()
    {
        let newX = Math.round(Math.random() * 500 - 50);
        let newY = Math.round(Math.random() * 5 + 100 - 50);

        if (this.hpText) {
            this.hpText.text = this.hp;
        }

        if (this.mpText) {
            this.mpText.text = this.mp;
        }
    }

    attack() 
    {
        let attack = Math.round(Math.random() * this.str + 2);
        if (this.statusAlive) {
            return attack;
        }
        return 0;
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
        console.log(spell);
        spell.setCaster(this);
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

    removeObject = () => {
        if (this.model) {
            this.model.destroy();
            this.hpText.destroy();
            this.mpText.destroy();
            this.hpText = null;
            this.mpText = null;
            this.model = null;
        }
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