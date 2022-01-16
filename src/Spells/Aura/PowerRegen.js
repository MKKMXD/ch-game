import AuraSpell from "../AuraSpell";
import RegenEffect from "../../Effects/RegenEffect";

export default class PowerRegen extends AuraSpell {

    constructor(scene, target) {
        super(scene);
        this.power = 0;
        this.typeTarget = "ally"
        this.name = "Power Regen"
        this.ico_name = "power_regen"
        this.cost = 0;
        this.effect = new RegenEffect(target);
        this.icoPath = "src/assets/Icons/Spells/BlessedMending.png"
        this.ico = null;
        this.targets = {};
    }

    clearAll = () => {
        if (this.targets) { 
            for (const key in this.targets) {
                if (Object.hasOwnProperty.call(this.targets, key)) {
                    const element = this.targets[key];
                    element.removeEffect(this.effect);
                }
            }
        }
    }

    use = (character) => {
        this.effect.setLevel(this.level);
        let addedEffect = character.addEffect(this.effect);

        if (addedEffect) {
            this.targets[character.getUid()] = character;
        }
    }
}