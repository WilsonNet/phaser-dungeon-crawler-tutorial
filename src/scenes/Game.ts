import Phaser from 'phaser';

export default class HelloWorldScene extends Phaser.Scene {
  constructor() {
    super('game');
  }

  preload() {}

  create() {
    // key = this.load.tilemapTiledJSON
    const map = this.make.tilemap({ key: 'dungeon' });
    // name = JSON tilesets.name, key = this.load.image
    const tileset = map.addTilesetImage('dungeon', 'tiles');
    // Nome das Layers no TIled
    map.createStaticLayer('Ground', tileset);
    const wallsLayer = map.createStaticLayer('Walls', tileset);

    wallsLayer.setCollisionByProperty({ collides: true });

    const debugGraphics = this.add.graphics().setAlpha(0.7);
    wallsLayer.renderDebug(debugGraphics, {
      tileColor: null,
      collidingTileColor: new Phaser.Display.Color(243, 234, 48, 255),
      faceColor: new Phaser.Display.Color(40, 39, 37, 255),
    });

    const faune = this.add.sprite(128, 128, 'faune', 'walk-down-3.png');
    this.anims.create({
      key: 'faune-idle-down',
      frames: [
        {
          key: 'faune',
          frame: 'walk-down-3.png',
        },
      ],
    });

    this.anims.create({
      key: 'faune-run-down',
      frames: this.anims.generateFrameNames('faune', {
        start: 1,
        end: 8,
        prefix: 'run-down-',
        suffix: '.png',
      }),    // Gera os frames com base no atlas
      repeat: -1,
      frameRate: 14
    });

    faune.anims.play('faune-run-down');
  }
}
