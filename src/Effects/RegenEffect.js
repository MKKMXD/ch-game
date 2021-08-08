import Effect from "./Effect";
export default class RegenEffect extends Effect{
    /**
     * 
     * @param {Character} target 
     */
    constructor(target) {
        /**@class Character */
        this.target = target;
        this.type = EFFECT_TYPES.CONST
    }

    up = () => {
        let hpRegen = this.target.getHpRegen();
        hpRegen += this.level*10;
        this.target.setHpRegen(hpRegen);
    }

    down = () => {
        let hpRegen = this.target.getHpRegen();
        hpRegen -= this.level*10;
        this.target.setHpRegen(hpRegen);
    }

}