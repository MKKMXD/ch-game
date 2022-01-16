import {STATE_LOADING}  from '../Config/States.js';
import Manager from './Manager';
import {SPELLS} from '../Spells/Spell';
import { CHARACTER_STATES } from '../Models/Character.js';
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
                //if (!characterCaster.getAliveStatus()) continue;
                if (characterCaster.getState() != CHARACTER_STATES.FIGHT && characterCaster.getState() != CHARACTER_STATES.WAIT) continue;
                
                let spells = characterCaster.getActiveSpells();
                if (spells.length) {
                    try { 
                        let counterUsed = 0;
                        let maxCounterByStep = 1;
                        spells.forEach( spell => {
                            spell.updateCooldown();
                            if (spell.isCanCast()) {
                                switch(spell.type) {
                                    case SPELLS.AOE_SPELL: 
                                        break;
                                    case SPELLS.AURA_SPELL:
                                        this.activateAura(spell, characterCaster.getUid(), characterCaster.getPosition());
                                        break;
                                    case SPELLS.CHAIN_SPELL:
                                        break;
                                    case SPELLS.PASSIVE_SPELL:
                                        this.activatePassive(spell, characterCaster)
                                        break;
                                    case SPELLS.SELF_SPELL:
                                        break;
                                    case SPELLS.TARGET_SPELL:
                                        counterUsed++;
                                        if ( counterUsed == maxCounterByStep ) {
                                            let result = this.castTarget(spell, characterCaster.getUid(), characterCaster.getPosition());
                                        }
                                        break;
                                }
                            }
                        })
                    } catch (error) {
                        console.log(error);
                    }
                }
            }
        }
    }

    collectTargets = (spell, targets, casterUid, position, type = null) => {
        let distance = spell.getDistanceCast();
        let avlbTargets = {}
        let maxHp = 0;

        for (const key in targets) {
            if (Object.hasOwnProperty.call(targets, key)) {
                let characterTargetCast = targets[key];

                let castTypeTarget = spell.getTypeTarget();
                if (characterTargetCast.getTeam() != spell.getCaster().getTeam() && castTypeTarget == "ally") continue;
                if (characterTargetCast.getTeam() == spell.getCaster().getTeam() && castTypeTarget == "enemy") continue;

                if (characterTargetCast.getUid() != casterUid || castTypeTarget == "any") {
                    let targetPosition = characterTargetCast.getPosition()
                    let distanceToTarget = this.getDistance(targetPosition.x, targetPosition.y , position.x, position.y);
                    if (distance >= distanceToTarget && characterTargetCast.getAliveStatus()) {
                        if (type) {
                            if (maxHp < parseInt(characterTargetCast.getMaxHealth())) maxHp = parseInt(characterTargetCast.getMaxHealth());
                            avlbTargets[parseInt(characterTargetCast.getHealth())] = characterTargetCast;
                        } else {
                            avlbTargets[characterTargetCast.getUid()] = characterTargetCast;
                        }
                    }
                }
            }
        }

        if ( type ) {
            let copy = Object.assign({}, avlbTargets);
            let rebuildAvlbTargets = {};
    
            for (const key in avlbTargets) {
                if (Object.hasOwnProperty.call(avlbTargets, key)) {
                    let newKey = Math.round(key * 100 / maxHp);
                    if (key == avlbTargets[key].getMaxHealth()) newKey = 100;
                    rebuildAvlbTargets[newKey] = avlbTargets[key];
                }
            }

            return rebuildAvlbTargets;
        }

        return avlbTargets;
    }

    castTarget = (spell, casterUid, position) => {
        if ( !spell.getCaster().getAliveStatus() ) return

        let rebuildAvlbTargets = this.collectTargets(spell, this.targets, casterUid, position, "cast")

        let keysHealth = Object.keys(rebuildAvlbTargets).sort(function(a, b) {
            return a - b;
        });

        let targetCharacter = null;
        if (keysHealth.length) {
            targetCharacter = rebuildAvlbTargets[keysHealth[0]];
        }
        
        if (targetCharacter && spell.getCaster().getMana() > spell.getCost()) {
            spell.use(targetCharacter);
        }
        
        return targetCharacter;
    }

    activateAura = (spell, casterUid, position) => {
        let avlbTargets = {}
        avlbTargets = this.collectTargets(spell, this.targets, casterUid, position);
        spell.clearAll();
        if (spell.getCaster().getAliveStatus()) {
            for (const key in avlbTargets) {
                if (Object.hasOwnProperty.call(avlbTargets, key)) {
                    spell.use(avlbTargets[key]);
                }
            }
        }
    }

    activatePassive = (spell, caster) => {
        if (caster.getAliveStatus()) {
            spell.use(caster);
        }
    }
}