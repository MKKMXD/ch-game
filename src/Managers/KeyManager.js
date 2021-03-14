import {STATE_LOADING}  from '../Config/States.js';
export default class KeyManager
{
    constructor (parent)
    {
        this.parent = parent
        this.state = STATE_LOADING;
        this.stateStatus = {
            [STATE_LOADING]: {
                49: false,
                50: false,
                51: false,
                52: false,
                13: true
            }
        }
    }

    setState(state) 
    {
        this.state = state;
    }

    checkButtonByState(keyCode) {
        console.log(keyCode);
        if (this.stateStatus[this.state]) {
            return this.stateStatus[this.state][keyCode];
        }

        return false;
    }
}