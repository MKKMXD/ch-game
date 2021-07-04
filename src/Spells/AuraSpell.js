
import {SPELLS} from './Spell';
import Spell from './Spell';

export default class AuraSpell extends Spell 
{
    constructor() {
        super();
        this.type = SPELLS.AURA_SPELL;
    }
}