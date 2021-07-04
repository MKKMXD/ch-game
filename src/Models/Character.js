export default class Character
{
    constructor(scene, x, y, type)
    {
        this.scene = scene;
        this.name = "character";
        this.model = null;
        this.hp = 100;
        this.hpText = null;
        this.statusAlive = true;
        this.modelFile = '';
        this.spells = [];
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
            default:
                this.modelFile = 'src/assets/Models/Characters/Character.png';
        }
        this.name = this.name + "_" + type;
        this.uid = this.generateUUID();
    }
    
    setName(name)
    {
        this.name = name;
    }

    load()
    {
        this.model = this.scene.load.image(this.name, this.modelFile);
    }

    setPosition(x, y)
    {
        this.model.x = x;
        this.model.y = y;
        this.hpText = this.scene.add.text(x + 10, y - this.model.height, this.hp, { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' });
    }

    getPosition()
    {
        let x = this.model.x;
        let y = this.model.y;
        return {x, y};
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
        this.hpText.text = this.hp;
    }

    attack() 
    {
        let attack = Math.round(Math.random()*5 + 10 - 5);
        //console.log(this.name, ', attacked:', attack);

        return attack;
    }

    getHealth = () => {
        return this.hp;
    }

    setDamage(damage)
    {
        //console.log(this.name, ', get damage:', damage);
        this.hp -= damage;
        if (this.hp <= 0) {
            this.statusAlive = false;
        }
    }
    
    addSpells = (spell) => {
        console.log(spell);
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
}