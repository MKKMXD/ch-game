
export const SPELLS = {
    TARGET_SPELL = "target",
    AOE_SPELL = "aoe",
    AURA_SPELL = "aura",
    CHAIN_SPELL = "chain",
    SELF_SPELL = "self",
    PASSIVE_SPELL = "passive",
}

export default class Spell {
    constructor() {
        this.type_resource = true;
        this.cost = 10;
    }
}