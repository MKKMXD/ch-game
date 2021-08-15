export const EFFECT_TYPES = {
    CONST: "const",
    AURA: "aura",
    BUFF: "buff",
    DEBUFF: "debuff"
}

export default class Effect {
    constructor(target) {
        this.target = target;
        this.type = EFFECT_TYPES.CONST
        this.level = 1;
        this.name = 'effect';
    }

    up = () => {

    }

    down = () => {

    }

    setLevel = (level) => {
        this.level = level;
    }

}