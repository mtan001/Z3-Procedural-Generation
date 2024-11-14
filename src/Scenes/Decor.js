class Decor extends Phaser.Scene {
    constructor() {
        super("decorScene");
    }
  
    preload() {
    }
  
    init() {
        this.TRANSPARENT = 131;
        this.WHEELBARROW = 57;
    }
  
    create() {
        console.log("decor!");
        let decorArray = Array.from({ length: tinyTownGrid.length }, () => Array(tinyTownGrid[0].length).fill(this.TRANSPARENT));
        decorArray[wheelbarrow[0]][wheelbarrow[1]] = this.WHEELBARROW;
        
        const decor = this.make.tilemap({
            data: decorArray,
            tileWidth: 16,
            tileHeight: 16
        })
        const decor_tilesheet = decor.addTilesetImage("tilemap_tiles")
        const decor_layer = decor.createLayer(0, decor_tilesheet, 0, 0);
        decor_layer.setScale(2);
        this.rKey = this.input.keyboard.addKey('R');
    }
  
    update() {
        if (Phaser.Input.Keyboard.JustDown(this.rKey)) {
            window.location.reload();
        }
    }
  }