const fs = require('fs');

// Function to read transactions from a JSON file
const readTransactionsFromFile = (filename) => {
    return new Promise((resolve, reject) => {
        // Read file asynchronously
        fs.readFile(filename, 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading file:', err);
                reject(err);
                return;
            }

            // Check if data is empty
            if (!data) {
                console.log('File is empty, returning empty array');
                resolve([]);
                return;
            }

            // Parse JSON data
            try {
                const parsedData = JSON.parse(data);
                resolve(parsedData);
            } catch (error) {
                console.error('Error parsing JSON:', error);
                reject(error);
            }
        });
    });
};


// Function to save transactions to a JSON file
const saveTransactionsToFile = (transactions,filename) => {
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

module.exports = {
    readTransactionsFromFile,
    saveTransactionsToFile,
}