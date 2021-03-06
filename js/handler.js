import ChangeListener from './ChangeListener.js';
const changeListener = new ChangeListener();

import Shows from "./pages/pageHandlers/showsHandler.js";

// Main pages
import FrontPage from "./pages/pages/frontpage.js";
import MoviePage from "./pages/pages/moviepage.js";
import ShowPage from "./pages/pages/showpage.js"
import SaloonPage from "./pages/pages/saloons.js"
import MyPage from "./pages/userPages/myPage.js"

// Movie info pages
import DetailPage from "./pages/moviepages/detailedMoviePage.js";

// Saloon
import LoginPage from "./pages/pages/loginpage.js";
import SignUpPage from "./pages/pages/signUpPage.js";

const frontPage = new FrontPage();
const moviePage = new MoviePage(changeListener)
const loginPage = new LoginPage();
const myPage = new MyPage();
const signUpPage = new SignUpPage(changeListener)
const saloonPage = new SaloonPage(changeListener)
const shows = new Shows(changeListener, saloonPage)

const showPage = new ShowPage(changeListener, shows)
const detailPage = new DetailPage(changeListener, shows)



export default class Handler {


  constructor(selector) {
    this.selector = selector;
    // main renders on location hash change
    // register the event listener for that:
    window.onhashchange = () => this.setCurrentPage(selector);
    // but also render it right now, based on the current hash or default page
    this.setCurrentPage(selector)
  }

  setCurrentPage(selector) {
    let name = window.location.hash.replace('-', '').replace('#', '');
    $(selector).html(this[name || 'default']());
  }


  movies() {
    return moviePage.getMovies();
  }

  shows() {
    return showPage.getAllShows()
  }

  Braveheart() {
    return detailPage.getMoviePage('Braveheart');
  }

  BrodernaLejonhjarta() {
    return detailPage.getMoviePage('BrodernaLejonhjarta');
  }
  WalterMitty() {
    return detailPage.getMoviePage('WalterMitty');
  }
  Zohan() {
    return detailPage.getMoviePage('Zohan');
  }
  Shawshank() {
    return detailPage.getMoviePage('Shawshank');
  }
  Kong() {
    return detailPage.getMoviePage('Kong');
  }

  saloon() {
    return
  }

  login() {
    return loginPage.readJson()
  }

  signUp() {
    return signUpPage.renderSignUp();
  }

  myPage() {
    return myPage.render();
  }

  default() {
    return frontPage.getMovies();
  }

}