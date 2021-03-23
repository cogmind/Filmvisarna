import ChangeListener from './ChangeListener.js';
const changeListener = new ChangeListener();

import Shows from "./pages/shows.js";

// Main pages
import FrontPage from "./pages/frontpage.js";
import MoviePage from "./pages/moviepage.js";
import ShowPage from "./pages/showpage.js"

// Movie info pages
import DetailPage from "./pages/moviepages/detailedMoviePage.js";

// Saloon
import LoginPage from "./pages/loginpage.js";
import SignUpPage from "./pages/signUpPage.js";

const shows = new Shows(changeListener)
const frontPage = new FrontPage();
const moviePage = new MoviePage(changeListener);
const showPage = new ShowPage(changeListener, shows)
const detailPage = new DetailPage(changeListener, shows);

const loginPage = new LoginPage();
const signUpPage = new SignUpPage(changeListener);

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

  login() {
    return loginPage.renderLogin()
  }

  signUp() {
    return signUpPage.renderSignUp();
  }

  default() {
    return frontPage.render();
  }

}