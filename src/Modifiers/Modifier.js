export default class Modifier {

    /**
     * 
     * @param {Modifier} modifier 
     */
    constructor(modifier) {
        this.level = 1;
        this.name = 'Modifier';
        this.modifier = modifier;
    }

    setLevel = (value) => {
        this.level = value
    }

    up = () => {

    }

    down = () => {

    }

    modify = (value) => {
        
    }

}