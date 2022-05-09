import Panel from "./Panel"

/**
 * GameInfoPanel
 */

export default class GameInfoPanel extends Panel
{
    constructor(scene, x, y) {
        super(scene, x, y);
        this.scene = scene
        this.width = 150;
        this.height = 300;
        this.x = x;
        this.y = y;
        this.setSize(this.width, this.height);
        this.textExp = null;
        this.textLevel = null;
        this.textPoints = null;
        this.fields = {
            'level' : {
                'title': 'Level: ',
                'objText': null,
                'objTitle': null,
                'value': 0,
                'x': 0,
                'y': 0,
                'type': 'integer'
            },
            'exp' : {
                'title': 'Exp: ',
                'objText': null,
                'objTitle': null,
                'value': 0,
                'x': 30,
                'y': 0,
                'type': 'integer'
            },
            'points' : {
                'title': 'Points: ',
                'objText': null,
                'objTitle': null,
                'value': 0,
                'x': 60,
                'y': 0,
                'type': 'integer'
            },
            'enemies' : {
                'title': 'Enemies: ',
                'objTitle': null,
                'objText': null,
                'value': 0,
                'x': 90,
                'y': 0,
                'type': 'integer'
            },
        };
        this.init();
    }
}