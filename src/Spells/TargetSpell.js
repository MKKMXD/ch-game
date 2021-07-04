
import {SPELLS} from './Spell';
import Spell from './Spell';

export default class TargetSpell extends Spell 
{
    constructor() {
        super();
        this.type = SPELLS.TARGET_SPELL;
    }

    use = (character) => {
        console.log(character);
        character.setDamage(-100);
    }
}