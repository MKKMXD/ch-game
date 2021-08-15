
import {SPELLS} from './Spell';
import Spell from './Spell';

export default class SelfSpell extends Spell 
{
    constructor(scene) {
        super(scene);
        this.type = SPELLS.SELF_SPELL;
    }
}