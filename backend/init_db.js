const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function initDB() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'root'
    });

    try {
        // Read schema file
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        // Split commands by semicolon (simple approach)
        // Note: This simple split might fail if semicolons are inside strings, but for this simple schema it's fine.
        const commands = schemaSql.split(';').filter(cmd => cmd.trim());

        for (const command of commands) {
            if (command.trim()) {
                await connection.query(command);
                console.log(`Executed: ${command.substring(0, 50)}...`);
            }
        }

        console.log('Database initialized successfully.');
    } catch (error) {
        console.error('Error initializing database:', error);
    } finally {
        await connection.end();
    }
}

initDB();
