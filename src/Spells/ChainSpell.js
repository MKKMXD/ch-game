
import {SPELLS} from './Spell';
import Spell from './Spell';

export default ChainSpell extends Spell 
{
    constructor() {
        super();
        this.type = SPELLS.CHAIN_SPELL;
    }
}