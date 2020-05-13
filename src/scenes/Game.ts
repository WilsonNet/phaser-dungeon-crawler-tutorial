import Phaser from 'phaser'

export default class HelloWorldScene extends Phaser.Scene
{
	constructor()
	{
		super('game')
	}

	preload()
    {

    }

    create()
    {
        this.add.image(0,0, 'tiles')
    }
}
