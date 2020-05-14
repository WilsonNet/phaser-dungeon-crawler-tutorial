import Phaser from 'phaser';

export default class HelloWorldScene extends Phaser.Scene {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private faune!: Phaser.Physics.Arcade.Sprite;
  constructor() {
    super('game');
  }

  preload() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

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

    this.faune = this.physics.add.sprite(128, 128, 'faune', 'walk-down-3.png');
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
      key: 'faune-idle-up',
      frames: [
        {
          key: 'faune',
          frame: 'walk-up-3.png',
        },
      ],
    });
    this.anims.create({
      key: 'faune-idle-side',
      frames: [
        {
          key: 'faune',
          frame: 'walk-side-3.png',
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
      }), // Gera os frames com base no atlas
      repeat: -1,
      frameRate: 14,
    });

    this.anims.create({
      key: 'faune-run-up',
      frames: this.anims.generateFrameNames('faune', {
        start: 1,
        end: 8,
        prefix: 'run-up-',
        suffix: '.png',
      }), // Gera os frames com base no atlas
      repeat: -1,
      frameRate: 14,
    });

    this.anims.create({
      key: 'faune-run-side',
      frames: this.anims.generateFrameNames('faune', {
        start: 1,
        end: 8,
        prefix: 'run-side-',
        suffix: '.png',
      }), // Gera os frames com base no atlas
      repeat: -1,
      frameRate: 14,
    });

    this.faune.anims.play('faune-idle-side');
  }

  update(t: number, dt: number) {
    const speed = 100;
    if (this.cursors.left?.isDown) {
      this.faune.anims.play('faune-run-side', true);
      this.faune.scaleX = -1;
      this.faune.setVelocity(-speed, 0);
    } else if (this.cursors.right?.isDown) {
      this.faune.anims.play('faune-run-side', true);
      this.faune.scaleX = 1;
      this.faune.setVelocity(speed, 0);
    } else if (this.cursors.up?.isDown) {
      this.faune.anims.play('faune-run-up', true);
      this.faune.setVelocity(0, -speed);
    } else if (this.cursors.down?.isDown) {
      this.faune.anims.play('faune-run-down', true);
      this.faune.setVelocity(0, speed);
    } else {
      this.faune.anims.play('faune-idle-down', true);
      this.faune.setVelocity(0, 0);
    }
  }
}
