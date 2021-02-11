
export default class KeyManager
{
    constructor (parent)
    {
        this.parent = parent
        this.upKey = parent.input.keyboard.addKey(Phaser.Keyboard.UP);
        this.downKey = parent.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        this.leftKey = parent.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        this.rightKey = parent.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    }

    setState() 
    {
        console.log(this.parent);
    }
}