import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Navigation from './Component/Navigation/Navigation';
import SignIn from './Component/SignIn/SignIn';
import Register from './Component/Register/Register';
import FaceRecognition from './Component/FaceRecognition/FaceRecognition';
import Logo from './Component/Logo/Logo';
import ImageLinkForm from './Component/ImageLinkForm/ImageLinkForm';
import Rank from './Component/Rank/Rank';
import './App.css';


const particlesOptions = {
  particles: {
    number: {
      value: 40,
      density: {
        enable: true,
        value_area: 500
      }
    }
  }
}

const initialState = {
    input: '',
    imageUrl: '',
    boxes: [],
    route: 'signIn',
    isSignIn: false,
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
    this.state= initialState;
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
    const boundingBoxes = data.outputs[0].data.regions.map(region => {
      return region.region_info.bounding_box
    });

    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);

    const facesLocation = boundingBoxes.map(box =>{
      return {
        leftCol: box.left_col * width,
        topRow: box.top_row * height,
        rightCol: width - (box.right_col * width),
        bottomRow: height - (box.bottom_row * height)
      }
    })
    
    return facesLocation;
}

displayFaceBoxes = (boxes) => {
  this.setState({boxes: boxes});
}

  onInputChange = (event) => {
    this.setState({input: event.target.value});

  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input})
        fetch('https://secure-crag-71842.herokuapp.com/imageurl', {
          method: 'post',
          headers: { 'Content-Type' : 'application/json'},
          body: JSON.stringify({
          input: this.state.input
          })
        })
        .then(response => response.json())
    .then(response => {
      if (response) {
        fetch('https://secure-crag-71842.herokuapp.com/image', {
          method: 'put',
          headers: { 'Content-Type' : 'application/json'},
          body: JSON.stringify({
          id: this.state.user.id
          })
        })
          .then(response => response.json())
          .then(count => {
            this.setState(Object.assign(this.state.user, {entries: count}))
          })
          .catch(console.log)
        }
      this.displayFaceBoxes(this.calculateFaceLocation(response))
    })
    .catch(err => console.log(err));
  }

  onRouteChange = (route) => {
    this.setState({route: route});

    if (route === 'signOut') {
      this.setState(initialState)
    } else if (route === 'home') {
      this.setState({isSignIn: true})
    }
  }

  render() {
    const { isSignIn,imageUrl, route, boxes } = this.state;
    return (
    <div className="App">
          <Particles className='particles' 
                params={particlesOptions}
              />
        <Navigation isSignIn={isSignIn} onRouteChange={this.onRouteChange} />
        {route === 'home' 
          ? <div>
          <Logo />
          <Rank name={this.state.user.name} entries={this.state.user.entries}/>
          <ImageLinkForm isDisabled={!this.state.input} onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
          <FaceRecognition boxes={boxes} imageUrl={imageUrl} />
            </div>

          : (
            this.state.route ==='signIn'
            ? <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
            : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
          )
        }
    </div>
    );
  }
}

export default App;
