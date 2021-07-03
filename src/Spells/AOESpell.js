
import {SPELLS} from './Spell';
import Spell from './Spell';

export default AOESpell extends Spell 
{
    constructor() {
        super();
        this.type = SPELLS.AOE_SPELL;
    }
}