import {STATE_LOADING}  from '../Config/States.js';
import {SPELLS} from '../Spells/Spell';
export default class SpellManager
{
    constructor (parent)
    {
        this.state = STATE_LOADING;
        this.queue = {};
        this.targets = {};
        this.spellState = false;
    }

    addTarget = (character) => {
        this.targets[character.getUid()]= character;
    }

    cast = () => {
        this.targets.forEach( characterCaster => { 
            let spells = characterCaster.getActiveSpells();
            spells.forEach( spell => {
                switch(spell.name) {
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
                        break;
                }
            })
        });
    }
}