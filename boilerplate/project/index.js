
/**
 * Welcome to Framer
 *
 * Learn how to prototype:
 * - http://framerjs.com/learn
 * - https://github.com/peteschaffner/framer-cli
 */

var Device = require('framer-device')
var UIStatusBar = require('framer-uistatusbar')
var myModule = require('myModule')

new Device({ deviceType: 'iphone-6-silver' })
new UIStatusBar({ style: 'light' })

var background = new BackgroundLayer({
  image: myModule.image
})

Utils.labelLayer(background, myModule.data.title)

var iconLayer = new Layer({
  width: 256/2,
  height: 256/2,
  image: 'images/framer-icon.png'
})
iconLayer.center()

// Define a set of states with names (the original state is 'default')
iconLayer.states.add({
  second: { y: 100, scale: 0.6, rotationZ: 100 },
  third:  { y: 300, scale: 1.3, blur: 4 },
  fourth: { y: 200, scale: 0.9, blur: 2, rotationZ: 200 }
})

// Set the default animation options
iconLayer.states.animationOptions = { curve: 'spring(500,12,0)' }


// On a click, go to the next state
iconLayer.on(Events.Click, () => iconLayer.states.next())
