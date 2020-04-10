import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation'
import Logo from './components/Logo/Logo'
import Rank from './components/Rank/Rank'
import FaceRecognition from './components/FaceRecognition/FaceRecognition'
import Particles from 'react-particles-js';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';


import 'tachyons'
import './App.css';




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

const initialState = {
  input:'',
  imgURL:'',
  box:{},
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
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
      isSignedIn: false,
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      }
    }
  }

  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
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

  onImageSubmit = () => {
    this.setState({imgURL:this.state.input});
    fetch('https://dry-river-93825.herokuapp.com/imageurl',  {
      method: 'post',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify({
        input:this.state.input
      })
    })
    .then(response => response.json())
    .then(response => {
      if(response) {
        fetch('https://dry-river-93825.herokuapp.com/image',  {
          method: 'put',
          headers: {'content-type': 'application/json'},
          body: JSON.stringify({
            id:this.state.user.id
          })
        })
          .then(response => response.json())
          .then(entries => {
            this.setState(Object.assign(this.state.user, {entries: entries}))
          })
          .catch(console.log)
      }
      this.displayFaceBox(this.calculateFaceLocation(response))
    })
    .catch(err => console.log(err));
  }

  onRouteChange = (route) => {
    if(route === 'home') {
      this.setState({ isSignedIn: true })
    } else if (route === 'signout') {
      this.setState(initialState)
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
            <Rank name={this.state.user.name} entries={this.state.user.entries}/>
            <ImageLinkForm 
              onInputChange={this.onInputChange} 
              onImageSubmit={this.onImageSubmit}
            />
            <FaceRecognition imgURL={imgURL} box={box}/>
          </div>
          : (
            route === 'signin'
          ? <SignIn loadUser = {this.loadUser} onRouteChange={this.onRouteChange}/>
          : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
          )
        }
      </div>
    );
  }
  
}

export default App;
