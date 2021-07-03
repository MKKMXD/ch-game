
import {SPELLS} from './Spell';
import Spell from './Spell';

export default SelfSpell extends Spell 
{
    constructor() {
        super();
        this.type = SPELLS.SELF_SPELL;
    }
}