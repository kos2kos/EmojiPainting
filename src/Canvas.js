import React, { Component } from 'react'
import { drawImageAtCoords, resize } from './canvasHelpers.js'

export default class Canvas extends Component {
  constructor(){
    super()
    this.state = {
      imgPNG: "http://localhost:3000/1.png",
      imagesArr: [],
      text: "Hey now",
      mouseDown: false,
      percentage: 1,
      frameNumerator: 2,
      frameDenomenator: 3,
      emoji: {
        animation: ""
      },
      ctx: "",
      x: 0,
      y: 0,
      dx: 4,
      dy: 1.2,
      c_width: 860,
      c_height: 500,
    }
  }


  percentageIncrease = () => {
    this.setState(prevState => {
      return {percentage: prevState.percentage + 1}
    })
  }

  frameIncrease = () => {
    this.setState(prevState => {
      return {frameNumerator: prevState.frameCount + 1}
    })
    this.setState(prevState => {
      return {frameDenomenator: prevState.frameCount + 1}
    })
  }


  handleKeyDown = (event) => {
    if (event.key === "2"){
      resize("+")
    }
    if (event.key === "1"){
      resize("-")
    }
  }

  handleEmojiSelect = (event) => {
    let id = event.target.id
    this.setState({imgPNG: `http://localhost:3000/${id}.png`})
    this.setState({emoji: {animation: ""}})
  }

  handleAnimateSelect = (event) => {
    console.log("ANIMATE_SELECT",event.target.id);
    this.setState({emoji: {animation: event.target.id}})
  }

  percentageReset = () =>{
    this.setState({percentage: 2})
  }

  handleMouseDown = (event) => {
    this.percentageReset()
    this.setState(prevState => {
      return {mouseDown: !prevState.mouseDown}
    })
  }

  handleMouseUp = (event) => {
    this.percentageReset()
    this.setState(prevState => {
      return {mouseDown: !prevState.mouseDown}
    })
  }

  handleMouseMove = (event) => {
    this.percentageIncrease()
    if (this.state.mouseDown){
      if(this.state.percentage % 2 === 0){
        // console.log("IMAGES STATE", this.state.imagesArr);
        this.setState({imagesArr: [...this.state.imagesArr,{imgName: this.state.imgPNG, x: event.clientX, y: event.clientY, initialX: event.clientX, initialY: event.clientY, animation: this.state.emoji.animation}]})

        drawImageAtCoords(event.clientX, event.clientY, this.state.imgPNG,
          this.state.emoji.animation)
      }
    }
  }

  animateHorizontal = (event) => {
    // requestAnimationFrame(this.animateHorizontal)
    this.state.ctx.fillStyle = 'purple';
    this.state.ctx.clearRect(0,0, 955,600)

    if (this.state.x > this.state.c_width ){
      this.setState({dx: -4, x: this.state.x + this.state.dx}, () => {
        console.log("this is dx", this.state.dx);
        this.state.ctx.fillRect(this.state.x + this.state.dx, 10, 100, 100)
      })
    }

    if (this.state.x < 0 ){
      this.setState({dx: 4, x: this.state.x + this.state.dx}, () => {
        console.log("this is dx", this.state.dx);
        this.state.ctx.fillRect(this.state.x + this.state.dx, 10, 100, 100)
      })
    }

    this.setState({x: this.state.x + this.state.dx}, () => {
      this.state.ctx.fillRect(this.state.x + this.state.dx, 10, 100, 100)
    })

  }

  drawImages = () => {
    let images = this.state.imagesArr
    for(let i = 0; i < images.length; i++){
      // console.log("dy :", images[i][2] + this.state.dy, images[i][0]);
      // images[i][2] = images[i][2] + this.state.dy
      // this.setState({imagesArr: images}, () => {

      // })
      console.log("IMAGE-I", images[i].x)
      if (images[i].animation === "vertical"){
        images[i] = this.animateImageVertical(images[i])
      } else if (images[i].animation === "horizontal") {
          images[i] = this.animateImageHoriztonal(images[i])
      }

      if (images[i].animation === "vertical"){
        images[i] = this.animateImageHoriztonal(images[i])
        this.setState({imagesArr: images}, () => {
          this.drawImageStroke(images[i].x, images[i].y, images[i].imgName,
            images.animation)
        })
      } else {
        this.drawImageStroke(images[i].x, images[i].y, images[i].imgName,
          images.animation)
      }
    }
  }

  animateImageVertical = (image) => {
    if (image.y + 10 > image.initialX ){
      this.setState({dy: -1.2}, () => {
          image.y = image.y + this.state.dy
      })
    } else if (image.y - 10 < image.initialX) {
      this.setState({dy: 1.2}, () => {
        image.y = image.y + this.state.dy
      })
    }
    return image
  }



  animateVertical = (event) => {
    requestAnimationFrame(this.animateVertical)
   // this.state.ctx.fillStyle = 'purple';
    this.state.ctx.clearRect(0,0, 955,600)
    const def = document.createElement("img")
    def.src = "1.png"
    // this.state.ctx.drawImage(def, 300,300)

    if (this.state.y > this.state.c_height ){
      this.setState({dy: -4, y: this.state.y + this.state.dy})
    }

    if (this.state.y < 0 ){
      this.setState({dy: 4, y: this.state.y + this.state.dy})
    }
    this.drawImages()

    this.setState({y: this.state.y + this.state.dy}, () => {
      // this.state.ctx.fillRect(this.state.y + this.state.dy, 10, 100, 100)
      // this.state.ctx.drawImage(def, 10, this.state.y + this.state.dy)
    })

  }



  drawImageStroke = (x, y, imgPNG, animation) =>{
    let colors = []
    let def = null
    let idx = 0
    let [sizeX, sizeY] = [95, 121]
    def = document.createElement("img")
    def.src = imgPNG

    console.log("drawing");
    const canvas = document.querySelector("canvas")
    const ctx = canvas.getContext("2d")
    const rect = canvas.getBoundingClientRect()
    const [cX, cY] = [rect.left, rect.top]

    let img
    if (false) {
      img = colors[idx]
      idx = (idx + 1) % 3
    } else {
      def.src = imgPNG
      def.className = "App-logo"
      console.log(def);
      img = def
    }

    this.state.ctx.drawImage(img, x - cX - 50, y - cY - 80, sizeX , sizeY)
  }

  componentDidMount() {
    const canvas = this.refs.canvas
    const plane = canvas.getContext("2d")
    this.setState({ctx: plane}, () => {
      // this.animateVertical()
    })
  }

  render(){
    return (
      <div>
        <div>
          <canvas
            ref="canvas"
            onMouseMove={this.handleMouseMove}
            onMouseDown={this.handleMouseDown}
            onMouseUp={this.handleMouseUp}
            onKeyDown={this.handleKeyDown}
            width='955'
            height='600'
            tabIndex="0"/>
        </div>
        <text> <br></br> </text>
        <text> <br></br> </text>
        <text> <br></br> </text>
        <text> <br></br> </text>
        <text> <br></br> </text>
        <text> <br></br> </text>
        <text> <br></br> </text>
        <text> <br></br> </text>
        <text> <br></br> </text>
        <text> <br></br> </text>
        <text> <br></br> </text>
        <text> <br></br> </text>
        <text> <br></br> </text>
        <text> <br></br> </text>
        <text> <br></br> </text>
        <text> <br></br> </text>
        <text> <br></br> </text>
        <text> <br></br> </text>
        <text> <br></br> </text>
        <text> <br></br> </text>
        <text> <br></br> </text>
        <text> <br></br> </text>
        <text> <br></br> </text>
        <text> <br></br> </text>
        <text> <br></br> </text>
        <text> <br></br> </text>
        <text> <br></br> </text>
        <text> <br></br> </text>
        <text> <br></br> </text>
        <text> <br></br> </text>
        <text> <br></br> </text>
        <text> <br></br> </text>
        <text> <br></br> </text>
        <text> <br></br> </text>
        <text> <br></br> </text>
        <text> <br></br> </text>

        <div class="container" >
          <img id = "1" src="1.png" alt=""onClick={this.handleEmojiSelect}/>
          <img id = "2" src="2.png" alt=""onClick={this.handleEmojiSelect}/>
          <img id = "3" src="3.png" alt=""onClick={this.handleEmojiSelect}/>
          <img id = "4" src="4.png" alt=""onClick={this.handleEmojiSelect}/>
          <img id = "5" src="5.png" alt=""onClick={this.handleEmojiSelect}/>
          <img id = "6" src="6.png" alt=""onClick={this.handleEmojiSelect}/>
          <img id = "7" src="7.png" alt=""onClick={this.handleEmojiSelect}/>
          <img id = "8" src="8.png" alt=""onClick={this.handleEmojiSelect}/>
          <img id = "9" src="9.png" alt=""onClick={this.handleEmojiSelect}/>
          <img id = "10" src="10.png" alt=""onClick={this.handleEmojiSelect}/>
          <img id = "11" src="11.png" alt=""onClick={this.handleEmojiSelect}/>
          <img id = "12" src="12.png" alt=""onClick={this.handleEmojiSelect}/>
          <text> <br></br> </text>

          <img id = "13" src="13.png" alt=""onClick={this.handleEmojiSelect}/>
          <img id = "14" src="14.png" alt=""onClick={this.handleEmojiSelect}/>
          <img id = "15" src="15.png" alt=""onClick={this.handleEmojiSelect}/>

          <img id = "16" src="16.png" alt=""onClick={this.handleEmojiSelect}/>
          <img id = "17" src="17.png" alt=""onClick={this.handleEmojiSelect}/>
          <img id = "18" src="18.png" alt=""onClick={this.handleEmojiSelect}/>

          <img id = "19" src="19.png" alt=""onClick={this.handleEmojiSelect}/>
          <img id = "20" src="20.png" alt=""onClick={this.handleEmojiSelect}/>
          <img id = "21" src="21.png" alt=""onClick={this.handleEmojiSelect}/>
          <img id = "22" src="22.png" alt=""onClick={this.handleEmojiSelect}/>
          <img id = "23" src="23.png" alt=""onClick={this.handleEmojiSelect}/>
          <img id = "24" src="24.png" alt=""onClick={this.handleEmojiSelect}/>

          <text> <br></br> </text>
          <text> <br></br> </text>

          <img class = "animation" id = "horizontal" src="horizontal.svg" alt=""onClick={this.handleAnimateSelect}/>
          <img class = "vertical" id = "vertical" src="vertical.svg" alt=""onClick={this.handleAnimateSelect}/>
          <img className = "clockwise" id = "App-logo" src="clockwise.svg" alt=""onClick={this.handleAnimateSelect}/>
          <text> <br></br> </text>
          </div>
      </div>
    )

  }
}
