import Phaser from 'phaser'
// import { debugDraw } from '../utils/debug'
import { createCharacterAnims } from '../anims/CharacterAnims'
import Lizard from '../enemies/Lizard'
import '../characters/Faune'
import Faune from '../characters/Faune'
import { sceneEvents } from '../events/EventCenter'
export default class HelloWorldScene extends Phaser.Scene {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private faune!: Faune
  private playerLizardCollider?: Phaser.Physics.Arcade.Collider
  private knives?: Phaser.Physics.Arcade.Group
  private lizards?: Phaser.Physics.Arcade.Group
  private hit = 0
  constructor () {
    super('game')
  }

  preload () {
    this.cursors = this.input.keyboard.createCursorKeys()
  }

  create () {
    //Run two scenes at the same time
    this.scene.run('game-ui')
    // key = this.load.tilemapTiledJSON
    const map = this.make.tilemap({ key: 'dungeon' })
    // name = JSON tilesets.name, key = this.load.image
    const tileset = map.addTilesetImage('dungeon', 'tiles', 16, 16, 1, 2)
    // Nome das Layers no TIled
    map.createStaticLayer('Ground', tileset)
    const wallsLayer = map.createStaticLayer('Walls', tileset)
    wallsLayer.setCollisionByProperty({ collides: true })
    // debugDraw(wallsLayer, this)

    this.knives = this.physics.add.group({
      classType: Phaser.Physics.Arcade.Image
    })

    Lizard.createLizardAnims(this.anims)
    createCharacterAnims(this.anims)
    this.faune = this.add.faune(128, 128, 'faune')
    this.faune.setKnives(this.knives)

    this.cameras.main.startFollow(this.faune, true)

    this.lizards = this.physics.add.group({
      classType: Lizard,
      createCallback: go => {
        const lizGo = go as Lizard
        lizGo.body.onCollide = true
      }
    })

    this.lizards.get(256, 128, 'lizard')
    this.physics.add.collider(this.lizards, wallsLayer)
    this.physics.add.collider(this.faune, wallsLayer)
    this.playerLizardCollider = this.physics.add.collider(
      this.lizards,
      this.faune,
      this.handlePlayerLizardCollision,
      undefined,
      this
    )
    this.physics.add.collider(
      this.knives,
      wallsLayer,
      this.handleKnifeWallCollision,
      undefined,
      this
    )
    this.physics.add.collider(
      this.knives,
      this.lizards,
      this.handleKnifeLizardCollision,
      undefined,
      this
    )
  }
  private handleKnifeWallCollision (
    knivesGo: Phaser.GameObjects.GameObject,
    wallsGo: Phaser.GameObjects.GameObject
  ) {
    this.knives?.killAndHide(knivesGo)
  }

  private handleKnifeLizardCollision (
    knivesGo: Phaser.GameObjects.GameObject,
    lizardGo: Phaser.GameObjects.GameObject
  ) {
    this.knives?.killAndHide(knivesGo)
    this.lizards?.killAndHide(lizardGo)
  }
  private handlePlayerLizardCollision (
    fauneGo: Phaser.GameObjects.GameObject,
    lizardGo: Phaser.GameObjects.GameObject
  ) {
    const lizard = lizardGo as Lizard
    const dx = this.faune.x - lizard.x
    const dy = this.faune.y - lizard.y
    const dir = new Phaser.Math.Vector2(dx, dy).normalize().scale(200)
    this.faune.handleDamage(dir)
    sceneEvents.emit('player-health-changed', this.faune.health)

    if (this.faune.health <= 0) {
      this.playerLizardCollider?.destroy()
    }
  }

  update (t: number, dt: number) {
    this.faune?.update(this.cursors)
  }
}
