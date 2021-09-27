const coffees = [
    { name: "Bryggkaffe", price: 20 },
    { name: "Cappucino", price: 30 },
    { name: "Latte", price: 40 }
]

class Customer {
    constructor() {
        this.transactions = []
        this.numberOfBoughtCups = 0 //Not used. Used before to declare getStatus()
        this.silverThreshold = 500 //Defines the limit for discount and membershipstatus
        this.goldThreshold = 1000
    }
    addTransaction(transaction) {
        this.transactions.push(transaction)
        this.numberOfBoughtCups += transaction.amount //old
    }
    getLatestTransaction() {
        return this.transactions[this.transactions.length - 1]
    }
    getStatus() {
        if (this.getTotalSpent() < this.silverThreshold) return "Brons"
        else if (this.getTotalSpent() >= this.silverThreshold && this.getTotalSpent() < this.goldThreshold) return "Silver"
        else if (this.getTotalSpent() >= this.goldThreshold) return "Guld"
    }
    getTotalSpent() {
        let sum = 0
        this.transactions.forEach(transaction => {
            sum += transaction.totalSpent
        })
        return sum
    }

}

//Get the select element
const coffeeMenu = document.getElementById("coffeeMenu")

//Add option from the coffees array
coffees.forEach((coffee, index) => {
    coffeeMenu.options.add(
        new Option(`${coffee.name} - ${coffee.price}`, index)
    )
})

//Get the menu div
const menuElement = document.getElementById("menu")

//A function to update the message to the user
const updateMenuMessage = (customer) => {
    const totalSpent = document.getElementById("totalSpent")
    const membershipStatus = document.getElementById("membershipStatus")

    totalSpent.innerHTML = `Du har handlat för ${customer.getTotalSpent()} kr`
    membershipStatus.innerHTML = `Medlemskapsstatus: ${customer.getStatus()}`
}

//Get the transaction list ul and h1 and set the html to the h1
const transactionList = document.getElementById("transactionList")
const transactionHeader = document.getElementById("transactionHeader")
transactionHeader.innerHTML = "Du har inga transaktioner"

//Function to add the transaction as a li element to the ul element
const addTransactionLi = (customer) => {
    const message = document.createElement("li")
    const transaction = customer.getLatestTransaction()
    message.innerHTML = `Du köpte ${transaction.amount} st ${transaction.name} för ${transaction.price} kr styck. Summa: ${transaction.totalSpent}`

    //Prepend the child istead of append so it shows at the top of the list
    transactionList.prepend(message)
    if (customer.transactions) {
        transactionHeader.innerHTML = "Dina transaktioner"
    }
}

//Create a new customer from the class Customer()
const customer = new Customer()

//Get the button, input and paragraph
const btn = document.getElementById("btn")
const input = document.getElementById("amountOfCups")
const errorMessage = document.getElementById("errorMessage")

//Eventlistener for the button
btn.addEventListener("click", (event) => {
    //Get the value from the input and select element and sets the errorMessage to empty string
    errorMessage.innerHTML = ""
    const name = coffees[coffeeMenu.value].name
    const amount = parseInt(input.value)
    const price = coffees[coffeeMenu.value].price
    let totalSpent = 0

    //Sets the value to totalSpent variable per cup bought so the discount is applied to every single cup
    for (let i = 0; i < amount; i++) {
        if (customer.getTotalSpent() + totalSpent >= 1000) {
            totalSpent += price * 0.85
        } else if (customer.getTotalSpent() + totalSpent < 1000 && customer.getTotalSpent() + totalSpent >= 500) {
            totalSpent += price * 0.9
        } else {
            totalSpent += price
        }
    }

    //Check if the input is not less than and over 10 and set a value to the errorMessage paragraph
    if (!amount < 1) {
        if (amount > 10) {
            errorMessage.innerHTML = "Du får inte köpa fler än 10 koppar"
        } else {
            //Add the transaction to the transaction array and call the message functions
            customer.addTransaction({ name: name, price: price, amount: amount, totalSpent: totalSpent })
            updateMenuMessage(customer)
            addTransactionLi(customer)
        }
    }
})