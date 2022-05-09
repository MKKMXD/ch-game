import HeroCreator from '../Creators/HeroCreator.js';
import EnemyCreator from '../Creators/EnemyCreator.js';
import Manager from './Manager';
import Log from '../Helpers/Log.js'

export default class PersonageManager extends Manager
{
    /**
     * @var Character
     */
    personage = null

    /**
     * @var Creator
     */
    creator = null

    create = (type, name) => {
        this.creator = new HeroCreator();
        this.personage = this.creator.create(this.scene, type, name);

        return this.personage;
    }

    createEnemy = (type, name) => {
        this.creator = new EnemyCreator();
        this.personage = this.creator.create(this.scene, type, name);

        return this.personage;
    }
}