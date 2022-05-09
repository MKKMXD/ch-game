import Phaser from "phaser"

export const HORIZONTAL_TYPE = "h";
export const VERTICAL_TYPE = "v";
/**
 * Panel
 */
 export default class Panel extends Phaser.GameObjects.Container 
 {
    constructor(scene, x = 0 , y = 0) {
        super(scene, x, y);
        this.scene = scene
        this.type = HORIZONTAL_TYPE;
        this.letterSpacing = 10;
        this.fields = {};
    }

    init = () => {
        const fields = this.fields;
        let x = 0;
        let y = 0;
        for (const key in fields) {
            if (Object.hasOwnProperty.call(fields, key)) {
                const field = fields[key];
                field.objTitle = new Phaser.GameObjects.Text(this.scene, x, y, field.title, { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif', color: '#00FF00', fontSize: '15px'})
                field.objTitle.visible = true;
                this.add(field.objTitle);
                field.objText = new Phaser.GameObjects.Text(this.scene, x + field.objTitle.displayWidth, y, field.value, { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif', color: '#00FF00', fontSize: '15px'})
                field.objText.visible = true;
                this.add(field.objText);

                if (this.type == HORIZONTAL_TYPE) {
                    x += this.letterSpacing + (field.objTitle.displayWidth + field.objText.displayWidth);
                } else {
                    y += this.letterSpacing + (field.objTitle.displayHeight + field.objText.displayHeight);
                }
            }
        }
    }

    render = () => {
        const fields = this.fields;
        for (const key in fields) {
            if (Object.hasOwnProperty.call(fields, key)) {
                const field = fields[key];
                field.objText.text = field.value;
            }
        }
    }

    setValue = (fieldName, value) => {
        if (Object.hasOwnProperty.call(this.fields, fieldName)) {
            this.fields[fieldName].value = value;
            this.render();
        }
    }

    getValue = (fieldName) => {
        let value = null;

        if (Object.hasOwnProperty.call(this.fields, fieldName)) {
            value = this.fields[fieldName].value;
        }

        return value;
    }

    addValue = (fieldName, value) => {
        let newValue = null;
        if (Object.hasOwnProperty.call(this.fields, fieldName)) {
            newValue = this.fields[fieldName].value;
            newValue += value;
            this.fields[fieldName].value = newValue;
            this.render();
        }

        return newValue;
    }
 }