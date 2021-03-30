export default class BookingsPage {

  constructor() {
    this.users = []
  }

  async getBookings() {
    this.usersJson = await JSON._load('../json/users.json')
    //this.bookings = await JSON._load('../json/receipt.json')// TODO Load from users instead.
    this.render()
    this.user = -1
  }

  render() {

    // For a specific person
    // TODO Local storage
    if (sessionStorage.getItem('username') === null) {
      alert('Please log in to see all your bookings')
      return
    }

    this.receipt = sessionStorage.getItem('tempReceipt')
    if (this.receipt !== null) {
      sessionStorage.removeItem('tempReceipt')
      console.log('Logging booking to User')
      for (let i = 0; i < this.usersJson.length; i++) {
        if (this.usersJson[i].user === sessionStorage.getItem('username')) {
          if (this.usersJson[i].bookings === undefined) {
            this.usersJson[i].bookings = []
          }
          this.usersJson[i].bookings.push(this.receiptJson)
          this.user = i
          break
        }
      }
      await JSON._save('../json/users.json', this.usersJson)
    }

    let someonesBooking = this.usersJson[this.user].bookings

    console.log('bookingspage render: someonesBooking', someonesBooking)

    $('main').html(`
      <h2>Bookings</h2>
    `)
    for (let booking of someonesBooking) {
      $('main').append(/*html*/`
        <div class="bookings">
          <p>Booking number: <strong>${booking[i].bookingNumber}</strong></p>
          <p>Movie: ${booking[i].bookedshowInfo.title}</p>
          <p>Saloon: ${booking[i].bookedshowInfo.saloon}</p>
          <p>Date: ${booking[i].bookedshowInfo.date}</p>
          <p>Time: ${booking[i].bookedshowInfo.time}:00</p>
          <p>Seats: ${booking[i].bookedshowInfo.bookedSeatsNumber}</p>
        </div >`)
    }
  }
}