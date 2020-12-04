import React from 'react';

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      name: '',
      error: false,
    }
  }

  onNameChange = (event) => {
    this.setState({name: event.target.value})
  }

  onEmailChange = (event) => {
    this.setState({email: event.target.value})
  }

  onPasswordChange = (event) => {
    this.setState({password: event.target.value})
  }

  onSubmitSignIn = () => {
    fetch('https://secure-crag-71842.herokuapp.com/register', {
      
      method: 'post',
      headers: { 'Content-Type' : 'application/json'},
      body: JSON.stringify({
        email: this.state.email,
        password: this.state.password,
        name: this.state.name
      })
    })
    .then(response => {
      if(!response.ok){
        this.setState({error: true})
      }
      return response.json()
    }) 
    .then(user => {
      if (user.id) {
        this.props.loadUser(user)
        this.props.onRouteChange('home');
        this.setState({error: false});
      } 
    })
  }

  onEnterKeySignIn = e => {
    if (e.keyCode === 13) {
      this.onSubmitSignIn();
    }
  };


  render() {
    return(
      <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
      <main className="pa4 black-80">
      <div className="measure"
           onKeyDown={this.onEnterKeySignIn}
           onSubmit={this.onSubmitSignIn}
      >
        <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
          <legend className="f1 fw6 ph0 mh0">Register</legend>
          <div className="mt3">
            <label className="db fw6 lh-copy f6" htmlFor="name">Name</label>
            <input onChange={this.onNameChange} className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" type="text" name="name"  id="name" />
            {this.state.error && !this.state.name && <div class="f6 lh-copy black-60 db mb2 pa1 dark-red b"> Please enter your Name. </div>}
          </div>
          <div className="mt3">
            <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
            <input onChange={this.onEmailChange} className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" type="email" name="email-address"  id="email-address" />
            {this.state.error && !this.state.email && <div class="f6 lh-copy black-60 db mb2 pa1 dark-red b"> Please enter your Email. </div>}
          </div>
          <div className="mv3">
            <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
            <input onChange={this.onPasswordChange} className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" type="password" name="password"  id="password" />
            {this.state.error && !this.state.password && <div class="f6 lh-copy black-60 db mb2 pa1 dark-red b"> Please enter your password. </div>}
          </div>
        </fieldset>
        <div className="">
          <input onClick={this.onSubmitSignIn} className="b ph3 pv2 input-reset ba b--black bg-transparent  pointer f6 dib" type="submit" value="Register" />
        </div>
      </div>
    </main>
    </article>
  );
  }
    
}

export default Register;