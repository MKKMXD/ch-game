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
    }

    up = () => {

    }

    down = () => {

    }

}