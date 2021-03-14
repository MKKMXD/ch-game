export default class Arena {
    constructor(scene, x, y)
    {
        this.scene = scene;
    }

    load()
    {
        //load objects sprites
    }

    setPosition(x, y)
    {
        this.container.x = x;
        this.container.y = y;
    }

    create()
    {
        this.container = this.scene.add.container(0, 0);
        //Create objects to enemy
    }

    addElement(element)
    {
        this.container.add(element);
    }

    update()
    {
        
    }
}