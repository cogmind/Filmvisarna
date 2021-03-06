const NORMAL_PRICE = 85
const SENIOR_PRICE = 75
const CHILD_PRICE = 65

let savedCheckboxes = []

export default class SaloonLogic {
  constructor(bookingHandler) {
    this.bookingHandler = bookingHandler
    this.tempSeatValues = []
    this.typeOfSeats = {}
    this.checkboxes = []
  }

  async getUserOnline() {
    let users = await JSON._load("../json/users.json");
    let userOnline = sessionStorage.getItem('username');

    for (let user of users) {
      if (user.username === userOnline) {
        this.currentUserData = user
      }
    }
  }

  reserveSeats() { 
    let allSeats = document.getElementsByName('seat-booking')
    let reservedSeats = [];
    for (let i = 0; i < allSeats.length; i++) {
      if (allSeats[i].checked === true) {
        reservedSeats[i] = true
      }
      else {
        reservedSeats[i] = false
      }
    }
    this.tempSeatValues = { ...reservedSeats }
  }

  getSelectedTypes() {
    this.typeOfSeats.normal = $('#normal-tickets').find("option:selected").text()
    this.typeOfSeats.child = $('#child-tickets').find("option:selected").text()
    this.typeOfSeats.senior = $('#senior-tickets').find("option:selected").text()
    this.typeOfSeats.normal = parseInt(this.typeOfSeats.normal)
    this.typeOfSeats.child = parseInt(this.typeOfSeats.child)
    this.typeOfSeats.senior = parseInt(this.typeOfSeats.senior)
    return (this.typeOfSeats.normal + this.typeOfSeats.child + this.typeOfSeats.senior)
  }

  getTotalCost() {
    let totalPrice = 0
    for (let key in this.typeOfSeats) {
      if (key === 'normal') {
        totalPrice += this.typeOfSeats[key] * NORMAL_PRICE
      }
      else if (key === 'child') {
        totalPrice += this.typeOfSeats[key] * CHILD_PRICE
      }
      else if (key === 'senior') {
        totalPrice += this.typeOfSeats[key] * SENIOR_PRICE
      }
    }
    return totalPrice;
  }

  iterateCheckedSeats() {
    let checkedBoxCount = 0;
    this.checkboxes = document.getElementsByName('seat-booking');
    for (let i = 0; i < this.checkboxes.length; i++) {
      if (this.checkboxes[i].checked) {
        checkedBoxCount++
      }
    }
    return checkedBoxCount
  }

  saveCheckedSeats() {
    savedCheckboxes = []
    for (let i = 0; i < this.checkboxes.length; i++) {
      savedCheckboxes.push(this.checkboxes[i].checked)
    }
  }

  reCheckSeats() {
    for (let i = 0; i < this.checkboxes.length; i++) {
      if (savedCheckboxes[i]) {
        if ($('#seat-' + i).is(':disabled')) {
          return false
        }
        else {
          $('#seat-' + i).prop('checked', true)
        }
      }
    }
    return true
  }

  checkSelectedIsCorrect() {
    let checkedBoxCount = this.iterateCheckedSeats()
    let totalPrice = this.getTotalCost()
    $('.menu-holder').removeClass('pulsating-red-border')
    if (this.getSelectedTypes() !== 0 && this.getSelectedTypes() === checkedBoxCount && checkedBoxCount !== 0) {
      $('.submit-seats').prop('disabled', false)
      $('.total-cost').html(/*html*/`<p>Total: ${totalPrice} SEK</p>`)
    }
    else if (this.getSelectedTypes() < this.iterateCheckedSeats()) {
      $(event.target).prop('checked', false)
      $('.submit-seats').prop('disabled', true)
    }
    else {
      $('.submit-seats').prop('disabled', true)
    }
    return (this.getSelectedTypes() === checkedBoxCount && checkedBoxCount !== 0)
  }

  async createSeatArray(showIndex) {
    this.reserveSeats()
    this.list = await JSON._load('../json/shows.json')

    let bookedSeatsNumber = []

    for (let i = 0; i < this.list[showIndex].takenSeats.length; i++) {
      if (this.tempSeatValues[i]) {
        this.list[showIndex].takenSeats[i] = this.tempSeatValues[i];
        bookedSeatsNumber.push(i + 1) 
      }
    }
    this.bookingHandler.createBookingsAndReceipt(this.list, bookedSeatsNumber, showIndex, this.getTotalCost(), this.typeOfSeats, this.currentUserData)
  }

  getNormalPrice() {
    return NORMAL_PRICE
  }

  getChildPrice() {
    return CHILD_PRICE
  }

  getSeniorPrice() {
    return SENIOR_PRICE
  }

  showHiddenButtons() {
    if (this.getSelectedTypes() > 0) {
      $('.seat-button-holder').show()
      return
    }
    $('.seat-button-holder').hide()
  }

  addSeatDisabled(seatCounter) {
    return /*html*/ `
    <input type="checkbox" name="seat-booking" class="seat seat-checkbox" id="seat-${seatCounter - 1}"
    value="${seatCounter}" disabled>
    <label for="seat-${seatCounter - 1}" class="seat" id="seat-label-${seatCounter - 1}">${seatCounter}</label>`;
  }

  addSeatActive(seatCounter) {
    return /*html*/`<input type="checkbox" name="seat-booking" class="seat seat-checkbox" id="seat-${seatCounter - 1
      }" value="${seatCounter}">
      <label for="seat-${seatCounter - 1}" class="seat" id="seat-label-${seatCounter - 1}">${seatCounter}</label>`;
  }

  async createEmptySaloons() {
    let showJson = await JSON._load('../json/shows.json')
    let saloonJson = await JSON._load('../json/saloons.json')
    let maxSeatSaloon;
    for (let eachShow of showJson) {
      if (eachShow.takenSeats === undefined) {
        eachShow.takenSeats = []
        if (eachShow.auditorium === "Big Tokyo") { maxSeatSaloon = saloonJson[0].seats }
        else { maxSeatSaloon = saloonJson[1].seats }
        for (let i = 0; i < maxSeatSaloon; i++) {
          eachShow.takenSeats[i] = false
        }
        await JSON._save("../json/shows.json", showJson);
      }
    }
  }
}