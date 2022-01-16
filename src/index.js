import Phaser from 'phaser';
import EasyStar from 'easystarjs'
import Managers  from './Managers/';
import Containers  from './Containers/';
import Models  from './Models/';
import {Spells}  from './Spells/index.js';
import Log from './Helpers/Log.js'
import {STATE_LOADING, STATE_FIGHT}  from './Config/States.js';
import CharacterSkillPanel from "./Panels/CharacterSkillPanel"
import { constant } from 'async';
import { CHARACTER_STATES } from './Models/Character';

class MyGame extends Phaser.Scene
{
    constructor ()
    {
        super();
        const area = [
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 1, 1, 1, 1, 1, 1, 0],
            [0, 1, 1, 1, 1, 0, 1, 0],
            [0, 0, 0, 1, 0, 0, 0, 0],
            [0, 0, 0, 1, 1, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
        ]
        this.easystar = new EasyStar.js();
        Log.scene = this;
        this.counter = 0;
        this.dashboard = null;
        this.charactersGroup = null;
        this.startTime = new Date().getTime();
        this.startTimeSec = new Date().getTime();
        this.currentState = STATE_LOADING
        this.selectedHero = null;
    }

    setState = (state) => {
        this.currentState = state;
        this.keyManager.setState(state);
        this.spellManager.setState(state);
        this.fightManager.setState(state)
    }

    preload ()
    {
        
        this.keyManager = new Managers.KeyManager(game);
        this.fightManager = new Managers.FightManager(game);
        this.spellManager = new Managers.SpellManager(game);
        this.setState(STATE_LOADING);

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

        this.initGame();

        this.loadSkillIcons(this);
    }
      
    create = () => {
        /**
         * Register all Keyboard Events
         */
        this.createPlayers();

        /**
         * Init Dashboard
         */
        
        this.initSkillBoard();

        this.containers.Arena.setPosition(100, 100);
        this.containers.Arena.fillMap();
        /**
         * Select hero
         */

        this.skillPanel = new CharacterSkillPanel(this, 200, 200);
        this.skillPanel.visible = true;
        this.containers.Arena.addElement(this.skillPanel);
    }

    update = () => {
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
            if (this.currentState == STATE_FIGHT) {
                this.lifeCycle();
                this.dispatchActions();
            }
            this.startTime =  new Date().getTime();
            this.counter = 0;
        }

        if ( (currentTime -  this.startTimeSec)/1000 > 0.1 ) {
            this.moveTo();
            this.startTimeSec =  new Date().getTime();
        }
    }

    moveTo = () => {
        for (const iterator of this.containers.Characters) {
            let steps = iterator.getPath();
            let sizeByMap = iterator.getMapSize();
            if (steps && steps.length) {
                iterator.setState(CHARACTER_STATES.WALK)
                let step = steps[0];
                let area = this.containers.Arena.getPositionsItems(sizeByMap.width, sizeByMap.height);
                if (!area[step.y][step.x]) {
                    iterator.moveTo();
                } 
            } else {
                iterator.setState(CHARACTER_STATES.WAIT)
                /*if (iterator.getTargetPoint()) {
                    let area = this.containers.Arena.getPositionsItems(sizeByMap.width, sizeByMap.height);
                    let obj = iterator.getTargetMove(area);
                    if (obj) {
                        this.createPath(obj, iterator)
                    }
                }*/
            }
        }

        for (const iterator of this.containers.Enemies) {
            let steps = iterator.getPath();
            let sizeByMap = iterator.getMapSize();
            if (steps && steps.length) {
                iterator.setState(CHARACTER_STATES.WALK)
                let step = steps[0];
                let area = this.containers.Arena.getPositionsItems(sizeByMap.width, sizeByMap.height);
                if (!area[step.y][step.x]) {
                    iterator.moveTo();
                } 
            } else {
                iterator.setState(CHARACTER_STATES.WAIT)
                if (iterator.getTargetPoint()) {
                    let area = this.containers.Arena.getPositionsItems(sizeByMap.width, sizeByMap.height);
                    let obj = iterator.getTargetMove(area);
                    if (obj) {
                        this.createPath(obj, iterator)
                    }
                }
            }
        }
    }

    lifeCycle = () => {
        for (const iterator of this.containers.Characters) {
            iterator.lifeCycle();
        }

        for (const iterator of this.containers.Enemies) {
            iterator.lifeCycle();
        }
    }

    initGame = () => {
        this.containers.Arena.create();
        for (const iterator of this.containers.Characters) {
            iterator.setTeam("my_team");
            this.fightManager.addToGroup(iterator, iterator.getTeam());
            this.spellManager.addTarget(iterator);
        }
        for (const iterator of this.containers.Enemies) {
            iterator.setTeam("enemy_team");
            this.fightManager.addToGroup(iterator, iterator.getTeam());
            this.spellManager.addTarget(iterator);
        }
    }

    createPlayers = () => {
        let moveY = 50;
        for (const iterator of this.containers.Characters) {
            iterator.getModel()
            this.containers.Arena.addElement(iterator);
            iterator.setPositionLegacy(0, 0);
            iterator.setPosition(300, moveY);
            iterator.setSize(19, 30);
            iterator.setInteractive();
            moveY += 50;
        }

        moveY = 50;
        for (const iterator of this.containers.Enemies) {
            iterator.getModel()
            this.containers.Arena.addElement(iterator);
            iterator.setPositionLegacy(0, 0);
            iterator.setPosition(100, moveY);
            iterator.setSize(19, 30);
            iterator.setInteractive();
            moveY += 50;
        }

        this.input.keyboard.on('keyup', (event) =>  {
            if (this.keyManager.checkButtonByState(event.keyCode)) {
                this.setState(STATE_FIGHT);
                console.log("Key register");
            } else {
                console.log("Wrong Key:", event.keyCode);
                this.setState(STATE_LOADING);
            }
        });
    }

    createEnemy = () => {
        for (let i = 0; i < 5; i++) {
            let enemy_character = new Models.Character(this, 0, 0, 'wave', i.toString() + '_wave');
            enemy_character.setName(i.toString() + '_wave');
            this.containers.Enemies.push(enemy_character);
        }
    }

    removeUnits = () => {
        for (const iterator of this.containers.Enemies) {
            if (!iterator.getAliveStatus()) {
                this.containers.Arena.removeElement(iterator);
                iterator.removeObject();
                iterator = null;
            }
        }

        for (const iterator of this.containers.Characters) {
            if (!iterator.getAliveStatus()) {
                this.containers.Arena.removeElement(iterator);
                iterator.removeObject();
                iterator = null;
            }
        }
    }

    dispatchActions = () => {
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
                let spell = new Spells[prop](this);
                let spellNameText = this.add.text(0, counter * moveY + y, spell.getName(), { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' });
                spellNameText.spell = Spells[prop];
                spellNameText.setInteractive();
                this.dashboard.add(spellNameText);
                counter++;
            }
        }

        this.input.on('gameobjectdown', (pointer, gameObject) => {
            if (this.dashboard.exists(gameObject)) {
                if (this.selectedHero) {
                    this.selectedHero.addSpells(new gameObject.spell(this));
                    this.renderSkillsOfCharacter(this.selectedHero)
                }
            } else if (this.containers.Arena.getContainer().exists(gameObject)) {
                if (gameObject.iteract) {
                    if ( this.selectedHero && this.selectedHero.getName() == gameObject.getName()) {
                        this.selectedHero.unIteract();
                        this.skillPanel.visible = false;
                        this.selectedHero = null;
                    } else {
                        if (this.selectedHero) {
                            this.selectedHero.unIteract();
                        }
                        this.selectedHero = gameObject;
                        gameObject.iteract();
                        this.renderSkillsOfCharacter(gameObject)
                    }
                }
            } else if (this.containers.Arena.getMapContainer().exists(gameObject)) {
                if (this.selectedHero) {
                    this.createPath(gameObject, this.selectedHero);
                }
            }
        });
    }

    createPath = (gameObject, hero) => {
        let sizeByMap = hero.getMapSize();
        let area = this.containers.Arena.getPositionsItems(sizeByMap.width, sizeByMap.height);
        this.easystar.setGrid(area);
        this.easystar.setAcceptableTiles([0]);
        let posHero = hero.getPosition()
        let curPos = [
            Math.ceil(posHero.x / sizeByMap.width),
            Math.ceil(posHero.y / sizeByMap.height)
        ];
        let targetPos = [
            Math.ceil(gameObject.x / sizeByMap.width),
            Math.ceil(gameObject.y / sizeByMap.height)
        ]
        
        this.easystar.findPath(curPos[1], curPos[0], targetPos[1], targetPos[0], (val) => {
            hero.setPath(val);
        });
        this.easystar.calculate();
    }

    renderSkillsOfCharacter = (character) => {
        this.skillPanel.removeAll();
        let mY = 0;
        character.getSpells().forEach(element => {
            let text = new Phaser.GameObjects.Text(this, 0, mY, element.getName() + " (" + element.getLevel() + ")", { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif', color: '#00FF00', fontSize: '15px'})
            text.visible = true;
            this.skillPanel.add(text);
            mY += 17;
        });
        this.skillPanel.visible = true;
    }

    loadSkillIcons = (scene) => {
        for (let prop in Spells) {
            if( Spells.hasOwnProperty( prop ) ) {
                let spell = new Spells[prop](scene);
                spell.load(scene);
            }
        }
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
