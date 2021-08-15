import Phaser from "phaser"
export const SPELLS = {
    TARGET_SPELL: "target",
    AOE_SPELL: "aoe",
    AURA_SPELL: "aura",
    CHAIN_SPELL: "chain",
    SELF_SPELL: "self",
    PASSIVE_SPELL: "passive",
}
//@todo extend Container for view by list
export default class Spell extends Phaser.GameObjects.Container {
    constructor(scene) {
        super(scene)
        this.type_resource = true;
        this.cost = 10;
        this.distanceCast = 200;
        this.level = 1;
        this.caster = null;
        this.typeTarget = "any";
        this.cooldown = 5;
        this.currentCooldown = 0;
        this.name = "";
        this.icoPath = "src/assets/Icons/Spells/BlessedMending.png"
        this.ico = null;
        this.ico_name = "power_regen"
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

    getCost = () => {
        return this.cost
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

    load = (scene) => {
        scene.load.image(this.ico_name, this.icoPath);
    }

    addToScene = (scene, x, y) => {
        this.ico = scene.add.sprite(x, y, this.ico_name);
    }
}