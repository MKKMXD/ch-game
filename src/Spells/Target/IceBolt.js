import TargetSpell from "../TargetSpell";

export default class IceBolt extends TargetSpell {

    constructor() {
        super();
        this.powerProc = 5;
        this.power = 10;
        this.typeTarget = "enemy"
        this.name = "Ice Bolt"
        this.cost = 15;
    }

    calculatePower = () => {
        let power = 0;
        power = (this.getLevel() * this.power);
        //power += this.caster.getMaxMana() * 5 / 100;
        power *= this.caster.getIntPower();
        return power;
    }

    use = (character) => {
        this.runCurrentCooldown();
        let powerDmg = this.calculatePower(); 
        this.getCaster().subtractMana(this.cost);
        //console.log(this.getCaster().getName(), "-> cast dmg to ->", character.getName(), "-> with power ->", powerDmg);
        character.setDamage(powerDmg);
    }
}