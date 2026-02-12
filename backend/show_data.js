const db = require('./config/db');

async function showData() {
    try {
        console.log('Fetching data from MySQL database: hostel_cms, table: maintenance_requests...\n');
        const [rows] = await db.query('SELECT * FROM maintenance_requests');

        if (rows.length === 0) {
            console.log('Table is currently empty.');
        } else {
            console.log('Found ' + rows.length + ' records:');
            console.table(rows);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    } finally {
        process.exit();
    }
}

showData();
