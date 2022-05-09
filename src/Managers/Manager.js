import {STATE_LOADING}  from '../Config/States.js';
export default class Manager
{
    constructor (parent, scene)
    {
        this.state = STATE_LOADING;
        this.parent = parent;
        this.scene = scene;
        this.panel = null;
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

    setPanel(panel) 
    {
        this.panel = panel;
    }
}