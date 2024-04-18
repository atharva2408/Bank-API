const readline = require('readline');
const fs = require('fs');


const ip = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});  

let transactions = [];
let balance = 0;
const filename = 'transactions.json';

// Function to ask a question and return the user's input
function askQuestion(question) {
    return new Promise(resolve => {
        ip.question(question, answer => {
            resolve(answer);
        });
    });
}

const userInput = async () => {
    let transactionType = await askQuestion("Credit or debit Transaction: ");
    let date = await askQuestion("Date of transaction (DD-MM-YYYY): ");
    let description = await askQuestion("Description of transaction: ");
    let amount = await askQuestion("Amount: ");

    if(transactionType==="credit"){
        balance = parseFloat(balance+amount);
    } else{
        balance = parseFloat(balance-amount);
    }

    return {
        date: date,
        description: description,
        transactionType: transactionType,
        amount: parseFloat(amount), // Convert amount to a number
        balance: balance
    };
}

const addTransaction = async () => {
    let transaction = await userInput();
    transactions.push(transaction);
}

// Function to save transactions to a JSON file
const saveTransactionsToFile = () => {
    // Check if the file exists
    if (!fs.existsSync(filename)) {
        // Create the file if it doesn't exist
        fs.writeFileSync(filename, '');
    }

    // Write transactions to the file
    fs.writeFile(filename, JSON.stringify(transactions, null, 2), (err) => {
        if (err) throw err;
        console.log('Transactions have been saved to transactions.json');
    });
};

// Function to read transactions from a JSON file
const readTransactionsFromFile = async() => {
    // Read file asynchronously
    fs.readFile(filename, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return;
        }

        // Parse JSON data
        try {
            const parsedData = JSON.parse(data);
            transactions = parsedData;
            if(transactions.length!=0){
                balance = transactions[transactions.length -1].balance;
            }
            
        } catch (error) {
            console.error('Error parsing JSON:', error);
        }
    });
};

// Function to display all transactions on the console
const displayTransactions = () => {
    console.log("All Transactions:");
    transactions.forEach((transaction, index) => {
        console.log(`Transaction ${index + 1}:`);
        console.log(`Date: ${transaction.date}`);
        console.log(`Description: ${transaction.description}`);
        console.log(`Transaction Type: ${transaction.transactionType}`);
        console.log(`Amount: ${transaction.amount}`);
        console.log(`Balance: ${transaction.balance}`);
        console.log("---------------------");
    });
};


(async () => {

    transactions = await readTransactionsFromFile();
    while(1){
        console.log("1. Add Transaction");
        console.log("2. Display Transaction");
        console.log("3. Check Balance");
        console.log("4. Exit");
        let option = parseInt( await askQuestion(`Enter your option: `));
        if(option == 1){
            await addTransaction();
        } else if(option == 2){
            displayTransactions();
        } else if(option == 3){
            console.log(`Current Balance: ${balance}`);
        } else if(option == 4){
            saveTransactionsToFile();
            break;
        } else{
            console.log("Enter valid input.")
        }
    }
    ip.close();
})();



