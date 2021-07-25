import {STATE_LOADING}  from '../Config/States.js';
import Manager from './Manager';

export default class FightManager extends Manager
{
    constructor (parent) {
        super(parent);
        this.state = STATE_LOADING;
        this.groups = {};
        this.fightState = false;
    }

    addToGroup(character, group_name) 
    {
        if (!this.groups[group_name]) {
            this.groups[group_name] = [];
        }
        this.groups[group_name].push(character);
    }

    startFight()
    {
        this.fightState = true;
    }

    endFight()
    {
        this.fightState = false;
    }

    toogleFight()
    {
        this.fightState = !this.fightState;
    }

    fight()
    {
        if (this.fightState) {
            for (const key in this.groups) {
                if (Object.hasOwnProperty.call(this.groups, key)) {
                    const group = this.groups[key];
                    let currentNameGroup = key;
                    let keys = Object.keys(this.groups);
                    const index = keys.indexOf(key);
                    if (index > -1) {
                        keys.splice(index, 1);
                    }

                    
                    
                    group.forEach(characterAttacking => { 
                        let targetAttacked = null;
                        let avlbAttacked = [];

                        keys.forEach(keyEnemyGroup => {
                            let enemyGroup = this.groups[keyEnemyGroup];
                            //@todo Сделать чтобы бил ближайшего
                            enemyGroup.forEach(characterAttacked => {
                                if (characterAttacked.getAliveStatus()) {
                                    avlbAttacked.push(characterAttacked);
                                }
                                //this.fightCharacters(characterAttacking, characterAttacked);
                            });
                        });
                        
                        avlbAttacked = this.shuffleArray(avlbAttacked);
                        if (avlbAttacked.length) {
                            targetAttacked = avlbAttacked[0];
                        }

                        if (targetAttacked) {
                            this.fightCharacters(characterAttacking, targetAttacked);
                        }
                    });

                    
                    
                }
            }
            this.endFight();
        }
    }

    fightCharacters(attackingUnit, attackedUnit)
    {
        attackedUnit.setDamage(attackingUnit.attack());
    }

    shuffleArray(arrayVal) {
        for (let i = arrayVal.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [arrayVal[i], arrayVal[j]] = [arrayVal[j], arrayVal[i]];
        }

        return arrayVal;
    }
}