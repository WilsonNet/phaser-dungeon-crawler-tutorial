import Phaser from 'phaser';
import { createLizardAnims } from '../anims/EnemyAnims';

export default class Lizard extends Phaser.Physics.Arcade.Sprite {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    frame?: string | number
  ) {
    super(scene, x, y, texture, frame);
    this.anims.play('lizard-idle');
  }

  static createLizardAnims = createLizardAnims;
}
