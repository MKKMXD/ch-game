import {STATE_LOADING}  from '../Config/States.js';
export default class Manager
{
    constructor (parent)
    {
        this.state = STATE_LOADING;
    }

    getDistance = (pointX, pointY, targetX, targetY) => {
        let y = targetX - pointX;
        let x = targetY - pointY;
        return Math.sqrt(x * x + y * y);
    }

    setState(state) 
    {
        this.state = state;
    }
}