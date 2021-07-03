import {STATE_LOADING}  from '../Config/States.js';
export default class FightManager
{
    constructor (parent)
    {
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
                        keys.forEach(keyEnemyGroup => {
                            let enemyGroup = this.groups[keyEnemyGroup];
                            enemyGroup.forEach(characterAttacked => {
                                this.fightCharacters(characterAttacking, characterAttacked);
                            });
                        });
                    });
                }
            }
            this.endFight();
        }
    }

    fightCharacters(attackingUnit, attackedUnit)
    {
        //console.log("Fight START");
        attackedUnit.getDamage(attackingUnit.attack());
        //console.log(attackingUnit, attackedUnit);
        //console.log("Fight END");
    }
}