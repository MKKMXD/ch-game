
import {SPELLS} from './Spell';
import Spell from './Spell';

export default class AuraSpell extends Spell 
{
    constructor(scene) {
        super(scene);
        this.type = SPELLS.AURA_SPELL;
        this.currentCooldown = 0;
    }

    clearAll = () => {
        
    }
}