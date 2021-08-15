import {STATE_LOADING, STATE_FIGHT}  from '../Config/States.js';
import Manager from './Manager';

export default class KeyManager extends Manager
{
    constructor (parent) {
        super(parent);
        this.parent = parent
        this.state = STATE_LOADING;
        this.stateStatus = {
            [STATE_LOADING]: {
                49: false,
                50: false,
                51: false,
                52: false,
                13: true
            },
            [STATE_FIGHT]: {
                49: false,
                50: false,
                51: false,
                52: false,
                13: true
            }
        }
    }

    checkButtonByState(keyCode) {
        console.log(keyCode);
        if (this.stateStatus[this.state]) {
            return this.stateStatus[this.state][keyCode];
        }

        return false;
    }
}