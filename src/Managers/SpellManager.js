import {STATE_LOADING}  from '../Config/States.js';
import Manager from './Manager';
import {SPELLS} from '../Spells/Spell';
export default class SpellManager extends Manager
{
    constructor (parent) {
        super(parent);
        this.state = STATE_LOADING;
        this.queue = {};
        this.targets = {};
        this.spellState = false;
    }

    addTarget = (character) => {
        this.targets[character.getUid()] = character;
        //console.log(this.targets);
    }

    cast = () => {
        for (const key in this.targets) {
            if (Object.hasOwnProperty.call(this.targets, key)) {
                let characterCaster = this.targets[key];
                if (!characterCaster.getAliveStatus()) continue;
                let spells = characterCaster.getActiveSpells();
                if (spells.length) {
                    try { 
                        spells.forEach( spell => {
                            spell.updateCooldown();
                            if (spell.isCanCast()) {
                                switch(spell.type) {
                                    case SPELLS.AOE_SPELL: 
                                        break;
                                    case SPELLS.AURA_SPELL:
                                        break;
                                    case SPELLS.CHAIN_SPELL:
                                        break;
                                    case SPELLS.PASSIVE_SPELL:
                                        break;
                                    case SPELLS.SELF_SPELL:
                                        break;
                                    case SPELLS.TARGET_SPELL:
                                        this.castTarget(spell, characterCaster.getUid(), characterCaster.getPosition());
                                        break;
                                }
                                throw new Error("Spell has been casted");
                            }
                        })
                    } catch (error) {
                        //console.log(error.message);
                    }
                }
            }
        }
    }

    castTarget = (spell, casterUid, position) => {
        let distance = spell.getDistanceCast();
        let avlbTargets = {}
        let maxHp = 0;
        for (const key in this.targets) {
            if (Object.hasOwnProperty.call(this.targets, key)) {
                let characterTargetCast = this.targets[key];

                let castTypeTarget = spell.getTypeTarget();
                if (characterTargetCast.getTeam() != spell.getCaster().getTeam() && castTypeTarget == "ally") continue;
                if (characterTargetCast.getTeam() == spell.getCaster().getTeam() && castTypeTarget == "enemy") continue;

                if (characterTargetCast.getUid() != casterUid || castTypeTarget == "any") {
                    let targetPosition = characterTargetCast.getPosition()
                    let distanceToTarget = this.getDistance(targetPosition.x, targetPosition.y , position.x, position.y);
                    if (distance >= distanceToTarget && characterTargetCast.getAliveStatus()) {
                        if (maxHp < parseInt(characterTargetCast.getMaxHealth())) maxHp = parseInt(characterTargetCast.getMaxHealth());
                        avlbTargets[parseInt(characterTargetCast.getHealth())] = characterTargetCast;
                    }
                }
            }
        }

        let copy = Object.assign({}, avlbTargets);
        let rebuildAvlbTargets = {};

        for (const key in avlbTargets) {
            if (Object.hasOwnProperty.call(avlbTargets, key)) {
                let newKey = Math.round(key * 100 / maxHp);
                if (key == avlbTargets[key].getMaxHealth()) newKey = 100;
                rebuildAvlbTargets[newKey] = avlbTargets[key];
            }
        }

        let keysHealth = Object.keys(rebuildAvlbTargets).sort(function(a, b) {
            return a - b;
        });

        let targetCharacter = null;
        if (keysHealth.length) {
            targetCharacter = rebuildAvlbTargets[keysHealth[0]];
        }

        if (targetCharacter) {
            spell.use(targetCharacter);
        }
        
        return targetCharacter;
    }
}