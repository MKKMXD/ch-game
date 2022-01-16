import PassiveSpell from "../PassiveSpell";
import CriticalStrikeModifier from "../../Modifiers/CriticalStrikeModifier";

export default class CriticalStrike extends PassiveSpell {

    constructor(scene, target) {
        super(scene);
        this.power = 0;
        this.typeTarget = "ally"
        this.name = "Critical Strike"
        this.ico_name = "critical_strike"
        this.cost = 0;
        this.modifier = new CriticalStrikeModifier();
        this.icoPath = "src/assets/Icons/Spells/BlessedMending.png"
        this.ico = null;
        this.targets = {};
        this.target = {};
    }

    use = (character) => {
        this.modifier.setLevel(this.level);
        this.target = character;
        character.addModifierAttack(this.modifier);
    }
}