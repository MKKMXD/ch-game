import Phaser from 'phaser'

export default class Arena {
    constructor(scene, x, y)
    {
        this.scene = scene;
        this.scene.load.image("tile_map", "src/assets/tile.png");
    }

    load()
    {
        //load objects sprites
    }

    setPosition(x, y)
    {
        this.container.setX(x);
        this.container.setY(y);
    }

    create = () => {
        this.container = this.scene.add.container(0, 0);
        //Create objects to enemy
    }

    addElement = (element) => {
        this.container.add(element);
        this.container.sendToBack(this.mapContainer);
    }

    getContainer = () => {
        return this.container;
    }

    getMapContainer = () => {
        return this.mapContainer;
    }

    fillMap = () => {
        this.mapContainer = this.scene.add.container(0, 0);
        this.container.add(this.mapContainer);

        this.widthT = 30;
        this.heightT = 30;
        let width = 20;
        let height = 10;
        this.map = [];
        let startX = 0;
        let startY = 0;

        this.widthPx = this.widthT * width;
        this.heightPx = this.heightT * height;

        for (let i = 0; i < width; i++) {
            this.map[i] = [];
            startY = 0;
            for (let j = 0; j < height; j++) {
                this.map[i][j] = 0;
                let tile = this.scene.add.sprite(startX, startY, "tile_map");
                tile.setSize(30, 30);
                tile.setInteractive();
                this.mapContainer.add(tile);
                startY += this.heightT;
            }
            startX += this.widthT;
        }
        this.container.sendToBack(this.mapContainer);
    }

    resetMap = () => {
        for (let i = 0; i < this.map.length; i++) {
            for (let j = 0; j < this.map[i].length; j++) {
                this.map[i][j] = 0;
            }
        }
    }

    getPositionsItems = (sizeW, sizeH) => {
        let newMap = [];
        this.resetMap();
        this.container.each((elem) => {
            if (elem.isMove && elem.getAliveStatus()) {
                let ceilX = Math.ceil((elem.x)/this.heightT);
                let ceilY = Math.ceil((elem.y)/this.heightT);
                if (this.map[ceilX]) {
                    this.map[ceilX][ceilY] = 1;
                }
            }
        }); 

        let lenX = Math.ceil(this.widthPx / sizeW);
        let lenY = Math.ceil(this.heightPx / sizeH);

        let counterCeilsX = Math.ceil(sizeW / this.widthT);
        if (this.widthT > sizeW) {
            counterCeilsX = Math.ceil(this.widthT / sizeW);
        }

        let counterCeilsY = Math.ceil(sizeH / this.heightT);
        if (this.heightT > sizeH) {
            counterCeilsY = Math.ceil(this.heightT / sizeH);
        }

        for (let i = 0; i < lenX; i++)
        {
            newMap[i] = [];
            for (let j = 0; j < lenY; j++)
            {
                if (lenX <= this.map.length) {
                    newMap[i][j] = 0;
                    for (let k = counterCeilsX * i; k < counterCeilsX * (i + 1); k++) {
                        for (let z = counterCeilsY * j; z < counterCeilsY * (j + 1); z++) {
                            if (this.map[k]) {
                                if(this.map[k][z]) {
                                    newMap[i][j] = 1;
                                }
                            }
                        }
                    }
                } else {
                    newMap[i][j] = 0;
                    let curJ = Math.ceil(j / counterCeilsY) - 1;
                    let curI = Math.ceil(i / counterCeilsX) - 1;
                    if (curJ < 0) curJ = 0;
                    if (curI < 0) curI = 0;
                    if (this.map[curI]) {
                        if(this.map[curI][curJ]) {
                            newMap[i][j] = 1;
                        }
                    }
                }
            }
        }

        return newMap;
    }

    update = () => {
        
    }
}