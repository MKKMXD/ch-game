import {STATE_LOADING}  from '../Config/States.js';
export default class FightManager
{
    constructor (parent)
    {
        this.state = STATE_LOADING;
        this.groups = {};
    }

    addToGroup(character, group_name) 
    {
        if (!this.groups[group_name]) {
            this.groups[group_name] = [];
        }
        this.groups[group_name].push(character);
    }
}