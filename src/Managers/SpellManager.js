import {STATE_LOADING}  from '../Config/States.js';
import Manager from './Manager';
import {SPELLS} from '../Spells/Spell';
export default class SpellManager extends Manager
{
    constructor (parent) {
        super(parent);
        this.state = STATE_LOADING;
        this.queue = {};
        this.targets = {};
        this.spellState = false;
    }

    addTarget = (character) => {
        this.targets[character.getUid()] = character;
        //console.log(this.targets);
    }

    cast = () => {
        for (const key in this.targets) {
            if (Object.hasOwnProperty.call(this.targets, key)) {
                let characterCaster = this.targets[key];
                let spells = characterCaster.getActiveSpells();
                spells.forEach( spell => {
                    switch(spell.type) {
                        case SPELLS.AOE_SPELL: 
                            break;
                        case SPELLS.AURA_SPELL:
                            break;
                        case SPELLS.CHAIN_SPELL:
                            break;
                        case SPELLS.PASSIVE_SPELL:
                            break;
                        case SPELLS.SELF_SPELL:
                            break;
                        case SPELLS.TARGET_SPELL:
                            this.castTarget(spell, characterCaster.getUid(), characterCaster.getPosition());
                            break;
                    }
                })
            }
        }
    }

    castTarget = (spell, casterUid, position) => {
        let distance = spell.getDistanceCast();
        let avlbTargets = {}
        for (const key in this.targets) {
            if (Object.hasOwnProperty.call(this.targets, key)) {
                let characterCaster = this.targets[key]
                if (characterCaster.getUid != casterUid) {
                    let targetPosition = characterCaster.getPosition()
                    let distanceToTarget = this.getDistance(targetPosition.x, targetPosition.y , position.x, position.y);
                    if (distance >= distanceToTarget) {
                        avlbTargets[parseInt(characterCaster.getHealth())] = characterCaster;
                    }
                }
            }
        }
        let copy = Object.assign({}, avlbTargets);
        console.log(copy)
        let keysHealth = Object.keys(avlbTargets).sort(function(a, b) {
            return a - b;
        });
        console.log(keysHealth);
        let targetCharacter = avlbTargets[keysHealth[0]];
        console.log(targetCharacter.name, targetCharacter.getHealth());
        spell.use(targetCharacter);
        
        return targetCharacter;
    }
}