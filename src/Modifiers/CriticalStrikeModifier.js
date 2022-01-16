import Modifier from "./Modifier";

export default class CriticalStrikeModifier extends Modifier 
{
    constructor () {
        super();
        this.name = "critical_strike_modifier";
    }

    modify = (value) => {
        let chance = Math.random() * 100;

        if (this.level * 10 < chance) {
            console.log("modify critical strike");
            value = value * 2;
        }

        return value;
    }
}