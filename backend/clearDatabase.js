//utilizzo: eseguire il comando `node clearDatabase.js` per eliminare il database

import fs from 'fs';
const dbPath = './database.db'; // Path del db sqlite
if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
    console.log('Database eliminato.');
} else {
    console.log('Nessun database trovato.');
}