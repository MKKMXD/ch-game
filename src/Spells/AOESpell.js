
import {SPELLS} from './Spell';
import Spell from './Spell';

export default class AOESpell extends Spell 
{
    constructor() {
        super();
        this.type = SPELLS.AOE_SPELL;
    }
}