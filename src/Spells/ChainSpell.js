
import {SPELLS} from './Spell';
import Spell from './Spell';

export default class ChainSpell extends Spell 
{
    constructor(scene) {
        super(scene);
        this.type = SPELLS.CHAIN_SPELL;
    }
}