import Panel from "./Panel"
/**
 * CharacterSkillPanel
 */
export default class CharacterSkillPanel extends Panel
{
    constructor(scene, x, y) {
        super(scene, x, y);
        this.scene = scene
        this.width = 150;
        this.height = 300;
        this.x = 0;
        this.y = 0;
        this.setSize(this.width, this.height);
    }
}