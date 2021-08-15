
import {SPELLS} from './Spell';
import Spell from './Spell';

export default class PassiveSpell extends Spell 
{
    constructor(scene) {
        super(scene);
        this.type = SPELLS.PASSIVE_SPELL;
    }
}