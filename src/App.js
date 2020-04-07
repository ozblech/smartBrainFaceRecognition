import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation'
import Logo from './components/Logo/Logo'
import Rank from './components/Rank/Rank'
import FaceRecognition from './components/FaceRecognition/FaceRecognition'
import Particles from 'react-particles-js';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';


import Clarifai from 'clarifai';
import 'tachyons'
import './App.css';


// initialize with your api key. This will also work in your browser via http://browserify.org/

const app = new Clarifai.App({
 apiKey: 'd85d6a1ec91c45869be4c981e37bab5f'
});


const particlesOptions = {
  particles: {
    number: {
      value:90,
      density: {
        enable:true,
        value_area: 500
      }
    },
    line_linked: {
      shadow: {
        enable: true,
        color: "#3CA9D1",
        blur: 5
      }
    }
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      input:'',
      imgURL:'',
      box:{},
      route: 'signin',
      isSignedIn: false
    }
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    console.log(width, height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    this.setState({box: box});
  }

  onInputChange = (event) => {
    this.setState({input:event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imgURL:this.state.input});
    app.models
    .predict(
      Clarifai.FACE_DETECT_MODEL, 
      this.state.input)
    .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
    .catch(err => console.log(err));
  }

  onRouteChange = (route) => {
    if(route === 'home') {
      this.setState({ isSignedIn: true })
    } else if (route === 'signout') {
      this.setState({ isSignedIn: false })
    }
    this.setState({ route:route })
  }

  render() {
    const {isSignedIn, imgURL, route, box} = this.state;
    return (
      <div className="App">
        <Particles className='particles'
          params={particlesOptions} 
        />
        <Navigation onRouteChange={this.onRouteChange} isSignedIn={isSignedIn}/>
        {(route === 'home') 
          ? 
          <div>
            <Logo />
            <Rank />
            <ImageLinkForm 
              onInputChange={this.onInputChange} 
              onButtonSubmit={this.onButtonSubmit}
            />
            <FaceRecognition imgURL={imgURL} box={box}/>
          </div>
          : (
            route === 'signin'
          ? <SignIn onRouteChange={this.onRouteChange}/>
          : <Register onRouteChange={this.onRouteChange}/>
          )
        }
      </div>
    );
  }
  
}

export default App;
