
export const SPELLS = {
    TARGET_SPELL: "target",
    AOE_SPELL: "aoe",
    AURA_SPELL: "aura",
    CHAIN_SPELL: "chain",
    SELF_SPELL: "self",
    PASSIVE_SPELL: "passive",
}

export default class Spell {
    constructor() {
        this.type_resource = true;
        this.cost = 10;
        this.distanceCast = 600;
        this.level = 1;
        this.caster = null;
        this.typeTarget = "any";
        this.cooldown = 5;
        this.currentCooldown = 0;
        this.name = "";
    }

    getName = () => {
        return this.name;
    }

    setCaster = (character) => {
        this.caster = character;
    }

    getCaster = () => {
        return this.caster;
    }

    isCanCast = () => {
        let isCan = !this.currentCooldown;
        //console.log(isCan);
        return isCan;
    }

    updateCooldown = () => {
        this.currentCooldown--;
        if (this.currentCooldown < 0) {
            this.currentCooldown = 0;
        }
        //console.log(this.currentCooldown);
    }

    runCurrentCooldown = () => {
        this.currentCooldown = this.cooldown;
    }

    getDistanceCast = () => {
        return this.distanceCast;
    }

    getLevel = () => {
        return parseInt(this.level);
    }

    setLevel = (level) => {
        this.level = level;
    }

    getTypeTarget = () => {
        return this.typeTarget;
    }
}