import Effect from "./Effect";
export default class RegenEffect extends Effect{
    /**
     * 
     * @param {Character} target 
     */
    constructor(target) {
        /**@class Character */
        super(target);
        this.name = 'RegenEffect';
    }

    up = (character) => {
        this.target = character;
        let hpRegen = this.target.getHpRegen();
        hpRegen += this.level*2;
        this.target.setHpRegen(hpRegen);
    }

    down = (character) => {
        this.target = character;
        let hpRegen = this.target.getHpRegen();
        hpRegen -= this.level*2;
        this.target.setHpRegen(hpRegen);
    }
}