export default class Character
{
    constructor(scene, x, y)
    {
        this.scene = scene;
        this.name = "character";
        this.model = null;
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
        let randX = -1 - 0.5 + Math.random() * (1 - (-1) + 1);
        let newX = Math.round(randX);
        let randY = -1 - 0.5 + Math.random() * (1 - (-1) + 1);
        let newY = Math.round(randY);
        this.model.x += newX;
        this.model.y += newY;
    }
}