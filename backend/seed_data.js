const db = require('./config/db');

async function seedData() {
    try {
        console.log('Inserting sample data into maintenance_requests...\n');

        const request = {
            roomId: '101',
            blockId: 'A',
            reportedBy: 'Student John',
            description: 'Leaking tap in bathroom',
            category: 'plumbing',
            priority: 'medium',
            status: 'reported'
        };

        const [result] = await db.query(
            'INSERT INTO maintenance_requests (roomId, blockId, reportedBy, description, category, priority, status, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())',
            [request.roomId, request.blockId, request.reportedBy, request.description, request.category, request.priority, request.status]
        );

        console.log('Sample data inserted successfully!');
        console.log('Insert ID:', result.insertId);

        // Show the data again
        const [rows] = await db.query('SELECT * FROM maintenance_requests');
        console.table(rows);

    } catch (error) {
        console.error('Error seeding data:', error);
    } finally {
        process.exit();
    }
}

seedData();
