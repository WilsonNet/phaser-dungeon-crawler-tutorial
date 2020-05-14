import Phaser from 'phaser';
import { debugDraw } from '../utils/debug';
import { createCharacterAnims } from '../anims/CharacterAnims';
import Lizard from '../enemies/Lizard';
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
    Lizard.createLizardAnims(this.anims);
    createCharacterAnims(this.anims)

    // key = this.load.tilemapTiledJSON
    const map = this.make.tilemap({ key: 'dungeon' });
    // name = JSON tilesets.name, key = this.load.image
    const tileset = map.addTilesetImage('dungeon', 'tiles', 16, 16, 1, 2);
    // Nome das Layers no TIled
    map.createStaticLayer('Ground', tileset);
    const wallsLayer = map.createStaticLayer('Walls', tileset);

    wallsLayer.setCollisionByProperty({ collides: true });

    // debugDraw(wallsLayer, this)

    this.faune = this.physics.add.sprite(128, 128, 'faune', 'walk-down-3.png');
    this.faune.body.setSize(this.faune.width * 0.5, this.faune.height * 0.8);

    this.faune.anims.play('faune-idle-side');
    this.physics.add.collider(this.faune, wallsLayer);
    this.cameras.main.startFollow(this.faune, true);

    const lizards = this.physics.add.group({
      classType: Lizard
    })

    lizards.get(256, 128, 'lizard')

    
  }

  update(t: number, dt: number) {
    const speed = 100;
    if (this.cursors.left?.isDown) {
      this.faune.anims.play('faune-run-side', true);
      this.faune.scaleX = -1;
      this.faune.body.offset.x = 24;
      this.faune.setVelocity(-speed, 0);
    } else if (this.cursors.right?.isDown) {
      this.faune.anims.play('faune-run-side', true);
      this.faune.scaleX = 1;
      this.faune.setVelocity(speed, 0);
      this.faune.body.offset.x = 8;
    } else if (this.cursors.up?.isDown) {
      this.faune.anims.play('faune-run-up', true);
      this.faune.setVelocity(0, -speed);
    } else if (this.cursors.down?.isDown) {
      this.faune.anims.play('faune-run-down', true);
      this.faune.setVelocity(0, speed);
    } else {
      const parts = this.faune.anims.currentAnim.key.split('-');
      parts[1] = 'idle';
      this.faune.anims.play(parts.join('-'), true);
      this.faune.setVelocity(0, 0);
    }
  }
}
