import Phaser from 'phaser';
import Managers  from './Managers/';
import Containers  from './Containers/';
import Models  from './Models/';
import {STATE_LOADING}  from './Config/States.js';

class MyGame extends Phaser.Scene
{
    constructor ()
    {
        super();
        this.keyManager = new Managers.KeyManager(game);
        this.keyManager.setState(STATE_LOADING);
        this.containers = {
            Arena: new Containers.Arena(this, 0, 0),
            Character: new Models.Character(this, 0, 0)
        };
    }

    preload ()
    {
        this.keyManager.setState(STATE_LOADING);
        this.containers.Character.load();
    }
      
    create ()
    {
        /**
         * Register all Keyboard Events
         */
        this.containers.Arena.create();
        this.containers.Arena.addElement(this.containers.Character.getModel());
        this.containers.Arena.setPosition(100, 100);
        //this.containers.Arena.addElement(this.containers.Character.getModel());
        this.input.keyboard.on('keyup', (event) =>  {
            //console.dir(event);
            if (this.keyManager.checkButtonByState(event.keyCode)) {
                dispatchActions();
                console.log("Key register");
            } else {
                console.log("Wrong Key:", event.keyCode);
            }
        });
    }

    update()
    {
        this.containers.Arena.update();
        this.containers.Character.update();
    }

    dispatchActions()
    {
        
    }
}

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: MyGame
};

const game = new Phaser.Game(config);
