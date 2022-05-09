import Creator from './Creator';
import Models  from '../Models/';

export default class HeroCreator extends Creator
{
    create = (parent, type, name) => {
        return new Models.Character(parent, 0, 0, type, name);
    }
}