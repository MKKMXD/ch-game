export default class Character
{
    constructor(scene, x, y)
    {
        this.scene = scene;
        this.name = "character";
        this.model = null;
        this.hp = 100;
        this.statusAlive = true;
    }

    load()
    {
        this.model = this.scene.load.image(this.name, 'src/assets/Models/Characters/Character.png');
    }

    setPosition(x, y)
    {
        this.model.x = x;
        this.model.y = y;
    }

    getModel()
    {
        this.model = this.scene.add.sprite(0, 0, this.name);
        return this.model;
    }

    update()
    {
        let newX = Math.round(100);
        let newY = Math.round(100);
        this.model.x = newX;
        this.model.y = newY;
    }

    attack() 
    {
        return 1;
    }

    getDamage(damage)
    {
        hp -= damage;
        if (hp <= 0) {
            this.statusAlive = false;
        }
    }
}