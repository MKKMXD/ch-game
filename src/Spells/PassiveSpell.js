
import {SPELLS} from './Spell';
import Spell from './Spell';

export default PassiveSpell extends Spell 
{
    constructor() {
        super();
        this.type = SPELLS.PASSIVE_SPELL;
    }
}