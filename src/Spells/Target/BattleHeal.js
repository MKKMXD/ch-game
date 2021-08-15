import TargetSpell from "../TargetSpell";

export default class BattleHeal extends TargetSpell {

    constructor(scene) {
        super(scene);
        this.powerProc = 5;
        this.power = 20;
        this.typeTarget = "ally"
        this.name = "Battle Heal"
        this.cost = 30;
    }

    calculatePower = () => {
        let power = 0;
        power = (this.getLevel() * this.power);
        power += this.caster.getMaxHealth() * 5 / 100;
        power *= this.caster.getIntPower();
        return power;
    }

    use = (character) => {
        this.runCurrentCooldown();
        let powerHeal = this.calculatePower(); 
        this.getCaster().subtractMana(this.cost);
        //console.log(this.getCaster().getName(), "-> cast heal to ->", character.getName(), "-> with power ->", powerHeal);
        character.addHealth(powerHeal);
    }
}