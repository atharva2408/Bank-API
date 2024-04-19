const express = require('express');
const app = express();
const port = 3000; 
const modules = require('./module')
const saveTransaction = modules.saveTransactionsToFile;
const readTransaction = modules.readTransactionsFromFile;

// Middleware to parse JSON request bodies
app.use(express.json());

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

// Example route to add a new transaction
app.post('/transactions/add', async (req, res) => {
    try {
        const newTransaction = req.body;
        let transactions = await readTransaction("transactions.json");

        let balance = 0;
        if (transactions.length > 0) {
            balance = transactions[transactions.length - 1].balance;
        }

        if (newTransaction.transactionType === "credit") {
            balance += newTransaction.amount;
        } else {
            balance -= newTransaction.amount;
        }

        const transaction = {
            date: newTransaction.date,
            description: newTransaction.description,
            transactionType: newTransaction.transactionType,
            amount: parseFloat(newTransaction.amount),
            balance: parseFloat(balance)
        };

        transactions.push(transaction);

        // Save updated transactions to the file
        await saveTransaction(transactions, "transactions.json");

        res.status(201).json(transaction);
    } catch (error) {
        console.error('Error adding transaction:', error);
        res.status(500).send("Failed to add transaction");
    }
});


//get all transactions
app.get('/transactions', async (req, res) => {
    // Return all transactions
    console.log("request was sent to /transactions");
    try {
        let transactions = await readTransaction("transactions.json");
        // console.log(transactions);
        res.status(200).json(transactions);
    } catch (error) {
        console.error('Error reading transactions:', error);
        res.status(500).send('Internal Server Error');
    }
});

// single transaction by ID
app.get('/transactions/:id', async (req, res) => {
    const transactionId = req.params.id;

    console.log("Request was sent to /transaction/:id")
    let transactions = await readTransaction("transactions.json");
    let transaction = transactions[transactionId-1];
    
    try {
        if(transaction){
            res.status(200).json(transaction);
        }else{
            throw "Invalid transaction ID"
        }
    } catch (error) {
        console.log(error);
        res.status(404).send(error);
    }
});
