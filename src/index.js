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
        this.fightManager = new Managers.FightManager(game);
        this.keyManager.setState(STATE_LOADING);
        this.containers = {
            Arena: new Containers.Arena(this, 0, 0),
            Characters: [
                new Models.Character(this, 0, 0, 'tank'),
                new Models.Character(this, 0, 0, 'mage'),
                new Models.Character(this, 0, 0, 'killer')
            ],
            Enemies: [

            ]
        };

        this.createEnemy();
        
        this.counter = 0;
        this.startTime = new Date().getTime();
    }

    preload ()
    {
        this.keyManager.setState(STATE_LOADING);
        for (const iterator of this.containers.Characters) {
            iterator.load();
        }

        for (const iterator of this.containers.Enemies) {
            iterator.load();
        }
    }
      
    create ()
    {
        /**
         * Register all Keyboard Events
         */
        this.containers.Arena.create();

        let moveY = 50;
        for (const iterator of this.containers.Characters) {
            this.containers.Arena.addElement(iterator.getModel());
            this.fightManager.addToGroup(iterator, "my_team");
            iterator.setPosition(700, moveY);
            moveY += 50;
        }

        moveY = 50;
        for (const iterator of this.containers.Enemies) {
            this.containers.Arena.addElement(iterator.getModel());
            this.fightManager.addToGroup(iterator, "enemy_team");
            iterator.setPosition(400, moveY);
            moveY += 50;
        }

        this.input.keyboard.on('keyup', (event) =>  {
            //console.dir(event);
            if (this.keyManager.checkButtonByState(event.keyCode)) {
                this.dispatchActions();
                console.log("Key register");
            } else {
                console.log("Wrong Key:", event.keyCode);
                this.fightManager.toogleFight();
            }
        });
    }

    update()
    {
        this.containers.Arena.update();
        for (const iterator of this.containers.Characters) {
            iterator.update();
        }

        this.counter++
        
        let currentTime = new Date().getTime();
        if ( (currentTime -  this.startTime)/1000 > 1 ) {
            console.log("FPS", this.counter);
            this.startTime =  new Date().getTime();
            this.counter = 0;
        }
    }

    createEnemy()
    {
        for (let i = 0; i < 5; i++) {
            let enemy_character = new Models.Character(this, 0, 0, 'tank');
            enemy_character.setName(i.toString() + '_tank');
            this.containers.Enemies.push(enemy_character);
        }
    }

    dispatchActions()
    {
        this.fightManager.startFight();
        this.fightManager.fight();
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
