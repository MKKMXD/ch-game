import Modifier from "./Modifier";

export default class CriticalStrikeModifier extends Modifier 
{
    constructor (modifier) {
        super(modifier);
        this.name = "critical_strike_modifier";
    }

    modify = (value) => {
        //let newValue = this.modifier.modify(value);
        let newValue = value;

        let chance = Math.random() * 100;

        if (this.level * 10 < chance) {
            console.log("modify critical strike");
            newValue = newValue * 2;
        }

        return newValue;
    }
}