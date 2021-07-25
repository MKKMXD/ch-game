
import {SPELLS} from './Spell';
import Spell from './Spell';

export default class TargetSpell extends Spell 
{
    constructor() {
        super();
        this.type = SPELLS.TARGET_SPELL;
        this.caster = null;
    }

    use = (character) => {
        character.setDamage(-60);
    }
}