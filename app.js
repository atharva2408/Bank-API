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

//get all transactions
app.get('/transactions/:custID', async (req, res) => {
    try {
        let transactions = await readTransaction("transactions.json");
        const custID = parseFloat(req.params.custID);
        let custID_transactions = transactions.filter(transaction => transaction.custID === custID);

        res.status(200).json(custID_transactions);
    } catch (error) {
        console.error('Error reading transactions:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Single transaction by ID for a specific customer
app.get('/transactions/:custID/:id', async (req, res) => {
    const custID = parseFloat(req.params.custID);
    const transactionId = parseInt(req.params.id);

    let transactions = await readTransaction("transactions.json");
    
    try {
        // Find transactions for the specified customer
        let custID_transactions = transactions.filter(transaction => transaction.custID === custID);
        
        // Find transaction by ID for the specified customer
        let transaction = custID_transactions[transactionId-1];
        
        if(transaction){
            res.status(200).json(transaction);
        } else {
            throw "Transaction not found";
        }
    } catch (error) {
        console.log(error);
        res.status(404).send(error);
    }
});

// deposit transaction
app.post('/transactions/deposit', async (req, res) =>{
    try{
        const transactionType = "credit";
        const newTransaction = req.body ;

        if (!newTransaction.custID || !newTransaction.date || !newTransaction.description || !newTransaction.amount) {
            throw new Error("Invalid transaction data");
        }

        const transactions = await readTransaction("transactions.json");
        const cust_transactions = transactions.filter(transction => transction.custID == newTransaction.custID);

        let balance = 0;
        if(cust_transactions.length>0){
            balance = cust_transactions[cust_transactions.length-1].balance;
        }
        balance+=newTransaction.amount;

        const transaction = {
            custID: newTransaction.custID,
            date: newTransaction.date,
            description: newTransaction.description,
            transactionType: transactionType,
            amount: newTransaction.amount,
            balance: balance
        };

        transactions.push(transaction);
        saveTransaction(transactions, "transactions.json");
        res.status(200).json(transaction);
    } catch(error){
        console.error('Error adding transaction:', error);
        res.status(500).send("Failed to add transaction");
    }
});

//withdrawl transaction
app.post('/transactions/withdrawl', async (req, res) =>{
    try{
        const transactionType = "debit";
        const newTransaction = req.body ;

        if (!newTransaction.custID || !newTransaction.date || !newTransaction.description || !newTransaction.amount) {
            throw new Error("Invalid transaction data");
        }

        const transactions = await readTransaction("transactions.json");
        const cust_transactions = transactions.filter(transction => transction.custID == newTransaction.custID);

        let balance = 0;
        if(cust_transactions.length>0){
            balance = cust_transactions[cust_transactions.length-1].balance;
        }
        balance-=newTransaction.amount;

        const transaction = {
            custID: newTransaction.custID,
            date: newTransaction.date,
            description: newTransaction.description,
            transactionType: transactionType,
            amount: newTransaction.amount,
            balance: balance
        };

        transactions.push(transaction);
        saveTransaction(transactions, "transactions.json");
        res.status(200).json(transaction);
    } catch(error){
        console.error('Error adding transaction:', error);
        res.status(500).send("Failed to add transaction");
    }

});
