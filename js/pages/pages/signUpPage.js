

export default class SignUpPage {
  constructor(changeListener) {
    this.changeListener = changeListener;
    this.addEventHandlers();
    this.read()
  }
  
  addEventHandlers() {
    $("body").on("click", "#signUpButton", () => this.saveUserData());
    this.changeListener.on("../json/users.json", () => this.read());
  }

  async read() {
  this.users = await JSON._load('../json/users.json');
  }


  renderSignUp() {
    $("main").html(/*html */ `<div class="signUpPage">
      <form class="form-signup">
        <h1>Sign up</h1>
        <h3>Type in your information:</h3>
        <input type="email" id="email" placeholder="Email">
        <input type="text" id="username" placeholder="Username">
        <input type="password" id="password" placeholder="Password">
        <button class="button-login-and-signup" id="signUpButton" type="submit">Create account</button>   
  </form>
  </div>`);
  }

  async saveUserData() {
    let email = document.getElementById("email").value;
    let username = document.getElementById("username").value;
    let pass = document.getElementById("password").value;
    
    if (username.length > 0 && pass.length > 0 && email.length > 0) {
      for (let user of this.users) {
        if (user.email === email) {
          alert('Email is already in use')
          return;
        }
        if (user.username === username) {
          alert('Username is already in use')
          return
        }
      }
    } else {
      alert('incorrect input')
      return
    }
    
    this.users.push({ email, username, pass }); 
    await JSON._save("../json/users.json", this.users);
    alert(`You have created a new user with username: ${username}`)
    location.href = "#login";
  } 
}
