import Phaser from 'phaser';
import Managers  from './Managers/';
import Containers  from './Containers/';
import Models  from './Models/';
import {Spells}  from './Spells/index.js';
import {STATE_LOADING}  from './Config/States.js';

class MyGame extends Phaser.Scene
{
    constructor ()
    {
        super();
        this.keyManager = new Managers.KeyManager(game);
        this.fightManager = new Managers.FightManager(game);
        this.spellManager = new Managers.SpellManager(game);
        this.keyManager.setState(STATE_LOADING);
        this.spellManager.setState(STATE_LOADING);
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
        this.dashboard = null;
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
        this.logText = this.add.text(0, 0, "", { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' });
        let moveY = 50;
        for (const iterator of this.containers.Characters) {
            this.containers.Arena.addElement(iterator.getModel());
            iterator.setTeam("my_team");
            this.fightManager.addToGroup(iterator, iterator.getTeam());
            this.spellManager.addTarget(iterator);
            iterator.setPosition(700, moveY);
            iterator.addSpells(new Spells.BattleHeal());
            iterator.addSpells(new Spells.IceBolt());
            moveY += 50;
        }

        moveY = 50;
        for (const iterator of this.containers.Enemies) {
            this.containers.Arena.addElement(iterator.getModel());
            
            iterator.setTeam("enemy_team");
            this.fightManager.addToGroup(iterator, iterator.getTeam());
            this.spellManager.addTarget(iterator);
            iterator.setPosition(400, moveY);
            iterator.addSpells(new Spells.IceBolt());
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

        /**
         * Init Dashboard
         */
        
        this.initSkillBoard();
        //  var sprite = this.add.sprite(400, 300, 'phaser');
        //  group.add(sprite);
    }

    update()
    {
        this.containers.Arena.update();
        for (const iterator of this.containers.Characters) {
            iterator.update();
        }

        for (const iterator of this.containers.Enemies) {
            iterator.update();
        }

        this.counter++
        
        let currentTime = new Date().getTime();
        if ( (currentTime -  this.startTime)/1000 > 1 ) {
            //console.log("FPS", this.counter);
            this.dispatchActions();
            this.startTime =  new Date().getTime();
            this.counter = 0;
        }

        this.logText.setText([
            'Name:',
            'Level: ',
            'Value: ',
            'Owner: '
        ]);
    }

    createEnemy()
    {
        for (let i = 0; i < 5; i++) {
            let enemy_character = new Models.Character(this, 0, 0, 'wave');
            enemy_character.setName(i.toString() + '_wave');
            this.containers.Enemies.push(enemy_character);
        }
    }

    removeUnits() 
    {
        for (const iterator of this.containers.Enemies) {
            if (!iterator.getAliveStatus()) {
                iterator.removeObject();
                iterator = null;
            }
        }
    }

    dispatchActions()
    {
        this.fightManager.startFight();
        this.fightManager.fight();
        this.spellManager.cast();
        this.removeUnits(); 
    }

    initSkillBoard = () => {
        this.dashboard = this.add.container(400, 300);
        this.dashboard.setSize(800, 600);
        let counter = 1;
        let y = 0;
        let moveY = 20;
        for (let prop in Spells) {
            if( Spells.hasOwnProperty( prop ) ) {
                let spell = new Spells[prop];
                let spellNameText = this.add.text(0, counter * moveY + y, spell.getName(), { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' });
                spellNameText.setInteractive()/*.on('pointerdown', this.selectCurrentSkill)*/;
                this.dashboard.add(spellNameText);
                counter++;
            }
        }
        /**
            this.dashboard.setInteractive().on('pointerdown', function(pointer, localX, localY, event){
                console.log(pointer);
            });
            this.dashboard.getAll.on('pointerdown', function(pointer, localX, localY, event){
                console.log('aaa');
            });
        **/

        this.input.on('gameobjectover', (pointer, gameObject) => {
            console.log(this.dashboard.exists(gameObject));
        });
    }

    selectCurrentSkill = (pointer, localX, localY, event) => {
        alert('');  
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
