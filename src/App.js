import React, { Component } from 'react';
import Navigation from './components/Navigation';
import Logo from './components/Logo';
import FaceRecognition from './components/FaceRecognition';
import ImageLinkForm from './components/ImageLinkForm';
import Signin from './components/Signin';
import Register from './components/Register';
import Rank from './components/Rank';
import Particles from 'react-particles-js';
import Modal from './components/Modal/Modal'
import Profile from './components/profile/Profile'
import './App.css';

const particlesOptions = {
    "particles": {
        "number": {
            "value": 80,
            "density": {
                "enable": true,
                "value_area": 800
            }
        },
        "color": {
            "value": "#ffffff"
        },
        "shape": {
            "type": "circle",
            "stroke": {
                "width": 0,
                "color": "#000000"
            },
            "polygon": {
                "nb_sides": 5
            },
            "image": {
                "src": "img/github.svg",
                "width": 100,
                "height": 100
            }
        },
        "opacity": {
            "value": 0.5,
            "random": false,
            "anim": {
                "enable": false,
                "speed": 1,
                "opacity_min": 0.1,
                "sync": false
            }
        },
        "size": {
            "value": 10,
            "random": true,
            "anim": {
                "enable": false,
                "speed": 80,
                "size_min": 0.1,
                "sync": false
            }
        },
        "line_linked": {
            "enable": true,
            "distance": 300,
            "color": "#ffffff",
            "opacity": 0.4,
            "width": 2
        },
        "move": {
            "enable": true,
            "speed": 12,
            "direction": "none",
            "random": false,
            "straight": false,
            "out_mode": "out",
            "bounce": false,
            "attract": {
                "enable": false,
                "rotateX": 600,
                "rotateY": 1200
            }
        }
    },
    "interactivity": {
        "detect_on": "canvas",
        "events": {
            "onhover": {
                "enable": false,
                "mode": "repulse"
            },
            "onclick": {
                "enable": true,
                "mode": "push"
            },
            "resize": true
        },
        "modes": {
            "grab": {
                "distance": 800,
                "line_linked": {
                    "opacity": 1
                }
            },
            "bubble": {
                "distance": 800,
                "size": 80,
                "duration": 2,
                "opacity": 0.8,
                "speed": 3
            },
            "repulse": {
                "distance": 400,
                "duration": 0.4
            },
            "push": {
                "particles_nb": 4
            },
            "remove": {
                "particles_nb": 2
            }
        }
    },
    "retina_detect": true
}

const initialState={
    input: '',
    imageUrl: '',
    boxes: [],
    route: 'Signin',
    isSignedIn: false,
    isProfileOpen:false,
    user:{
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: '',
        pet:'',
        age:''
    }
}

class App extends Component {
    constructor() {
        super();
        this.state = initialState;
    }

    componentDidMount(){
        const token = window.sessionStorage.getItem('token');
        if(token){
            fetch('http://localhost:3000/signin',{
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': token
                },
            })
            .then(resp=>resp.json())
            .then(data=>{
                if( data && data.id){
                    fetch(`http://localhost:3000/profile/${data.id}`,{
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'authorization': token
                    },
                    })
                    .then(resp=>resp.json())
                    .then(user=>{
                        if (user && user.email){
                            this.loadUser(user);
                            this.onRouteChange('Home')
                        }
                    })
                }
            })
            .catch(console.log)
        }
    }

    loadUser=(data)=>{
        this.setState({user: {
            id: data.id,
            name: data.name,
            email: data.email,
            entries: data.entries,
            joined: data.joined
        }})
    }

    // componentDidMount() {
    //     fetch('http://localhost:3000')
    //         .then(response => response.json())
    //         .then(data => console.log(data))
    // }

    calculateFaceLocations = (data) => {
        if(data && data.outputs){
            return data.outputs[0].data.regions.map(face=>{
               const clarifaiFace=face.region_info.bounding_box;
               const image = document.getElementById('inputImage');
               const width = Number(image.width);
               const height = Number(image.height);
               return {
                   leftCol: clarifaiFace.left_col * width,
                   topRow: clarifaiFace.top_row * height,
                   rightCol: width - (clarifaiFace.right_col * width),
                   bottomRow: height - (clarifaiFace.bottom_row * height),
               }
            })
        }
        return;
    }
    displayFaceBoxes = (boxes) => {
        if (boxes){
            this.setState({ boxes });
        }
    }

    onInputChange = (event) => {
        this.setState({ input: event.target.value });
    }

    onButtonSubmit = () => {
        this.setState({ imageUrl: this.state.input })
        fetch('http://localhost:3000/imageurl',{
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'authorization': window.sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                input: this.state.input,
            })
        })
        .then(response=>response.json())
       .then((response) => {
            if(response){
                fetch('http://localhost:3000/image',{
                    method: 'put',
                    headers: {
                        'Content-Type': 'application/json',
                        'authorization': window.sessionStorage.getItem('token')
                    },
                    body: JSON.stringify({
                        id: this.state.user.id,
                    })
                }).then(response=>{
                   return  response.json()
                }).then(count=>{

                   this.setState(Object.assign(this.state.user, {entries: count}))

                    })
                    .catch(err=>console.log(err))
            }
            this.displayFaceBoxes(this.calculateFaceLocations(response));
        }).catch(err => console.log(err));
    }

    onRouteChange = (route) => {
        if (route === 'Signout') {
            return this.setState(initialState);
            // this.setState({ isSigedIn: false });
        } else if (route === 'Home') {
            this.setState({ isSignedIn: true });
        }
        this.setState({ route });
    }

    toogleModal=()=>{
        this.setState(prevState=>(
            {
                ...prevState,
                isProfileOpen: !prevState.isProfileOpen
            }
        ) )
    }

    render() {
        const { isSignedIn, boxes, imageUrl, route,isProfileOpen } = this.state;
        const { onRouteChange, onButtonSubmit, onInputChange, loadUser } = this;
        return ( <div className = "App" >
            <Particles className = 'particles' params = { particlesOptions } />
            <Navigation isSignedIn = { isSignedIn }  onRouteChange = { onRouteChange } toogleModal={this.toogleModal}/>
            {isProfileOpen &&
                <Modal>
                    <Profile isPofileOpen={isProfileOpen} toogleModal={this.toogleModal} user={this.state.user} loadUser={loadUser}/>
                </Modal>
            }
            {route === 'Home' ?
                <div>
                    <Logo />
                    <Rank name={this.state.user.name} entries={this.state.user.entries} />
                    <ImageLinkForm onInputChange = { onInputChange } onButtonSubmit = { onButtonSubmit } />
                    <FaceRecognition boxes = { boxes }  imageUrl = { imageUrl } />
                </div >
                :
                (route === 'Signin' ?
                <Signin loadUser={loadUser} onRouteChange = { onRouteChange } />
                :
                <Register loadUser={loadUser} onRouteChange = { onRouteChange } />
            )
             } </div>
    );
}
}

export default App;