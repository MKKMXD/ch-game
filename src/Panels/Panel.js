import Phaser from "phaser"
/**
 * Panel
 */
 export default class Panel extends Phaser.GameObjects.Container 
 {
    constructor(scene, x = 0 , y = 0) {
        super(scene, x, y);
        this.scene = scene
    }
 }