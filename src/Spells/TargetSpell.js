
import {SPELLS} from './Spell';
import Spell from './Spell';

export default TargetSpell extends Spell 
{
    constructor() {
        super();
        console.log(SPELLS.TARGET_SPELL);
        this.type = SPELLS.TARGET_SPELL;
    }
}