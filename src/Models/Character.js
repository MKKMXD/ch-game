export default class Character
{
    constructor(scene, x, y, type)
    {
        this.scene = scene;
        this.name = "character";
        this.model = null;
        this.hp = 100;
        this.statusAlive = true;
        this.modelFile = '';
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
        /*this.model.x = newX;
        this.model.y = newY;*/
    }

    attack() 
    {
        let attack = Math.round(Math.random()*5 + 10 - 5);
        console.log(this.name, ', attacked:', attack);

        return attack;
    }

    getDamage(damage)
    {
        console.log(this.name, ', get damage:', damage);
        this.hp -= damage;
        if (this.hp <= 0) {
            this.statusAlive = false;
        }
    }
}