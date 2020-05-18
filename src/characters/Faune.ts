import Phaser from 'phaser'

declare global {
  namespace Phaser.GameObjects {
    interface GameObjectFactory {
      faune(
        x: number,
        y: number,
        texture: string,
        frame?: string | number | undefined
      ): Faune
    }
  }
}

export default class Faune extends Phaser.Physics.Arcade.Sprite {
  constructor (
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    frame?: string | number | undefined
  ) {
    super(scene, x, y, texture, frame)
    this.anims.play('faune-idle-down')
  }
  update(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {

    const speed = 100
    if (cursors.left?.isDown) {
      this.anims.play('faune-run-side', true)
      this.scaleX = -1
      this.body.offset.x = 24
      this.setVelocity(-speed, 0)
    } else if (cursors.right?.isDown) {
      this.anims.play('faune-run-side', true)
      this.scaleX = 1
      this.setVelocity(speed, 0)
      this.body.offset.x = 8
    } else if (cursors.up?.isDown) {
      this.anims.play('faune-run-up', true)
      this.setVelocity(0, -speed)
    } else if (cursors.down?.isDown) {
      this.anims.play('faune-run-down', true)
      this.setVelocity(0, speed)
    } else {
      const parts = this.anims.currentAnim.key.split('-')
      parts[1] = 'idle'
      this.anims.play(parts.join('-'), true)
      this.setVelocity(0, 0)
    }
  }
  
}

Phaser.GameObjects.GameObjectFactory.register('faune', function (
  this: Phaser.GameObjects.GameObjectFactory,
  x: number,
  y: number,
  texture: string,
  frame?: string | number | undefined
) {
  var sprite = new Faune(this.scene, x, y, texture, frame)

  this.displayList.add(sprite)
  this.updateList.add(sprite)
  this.scene.physics.world.enableBody(
    sprite,
    Phaser.Physics.Arcade.DYNAMIC_BODY
  )
  sprite.body.setSize(sprite.width * 0.5, sprite.height * 0.8)
  return sprite
})
