import {STATE_LOADING, STATE_FIGHT}  from '../Config/States.js';
import { CHARACTER_STATES } from '../Models/Character.js';
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
        for (const key in this.groups) {
            const group = this.groups[key];
            group.forEach(characterAttacking => {
                if (characterAttacking.getState() != CHARACTER_STATES.DEATH) {
                    characterAttacking.setState(CHARACTER_STATES.FIGHT)
                }
            })
        }
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
        if (this.state == STATE_FIGHT) {
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
                        if (characterAttacking.getState() == CHARACTER_STATES.FIGHT) {
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

                            if (characterAttacking.getTargetAttack()) {
                                targetAttacked = characterAttacking.getTargetAttack()
                            }

                            characterAttacking.setState(CHARACTER_STATES.WAIT);
                            if (targetAttacked) {
                                this.fightCharacters(characterAttacking, targetAttacked);
                            }
                        }
                    });

                    
                    
                }
            }
            this.endFight();
        }
    }

    fightCharacters(attackingUnit, attackedUnit)
    {
        let attackRange = attackingUnit.checkAttackRange(attackedUnit);
        if ( attackRange < 50 ) {
            attackingUnit.setTargetAttack(attackedUnit);
            attackedUnit.setDamage(attackingUnit.attack());
        } else {
            if (!attackingUnit.getTargetPoint()) {
                attackingUnit.setTargetPoint(attackedUnit);
            }
        }
    }

    shuffleArray(arrayVal) {
        for (let i = arrayVal.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [arrayVal[i], arrayVal[j]] = [arrayVal[j], arrayVal[i]];
        }

        return arrayVal;
    }
}