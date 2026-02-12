const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./config/db');
// Removed email functionality completely
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Basic route
app.get('/', (req, res) => {
    res.json({ message: 'Hostel Management System API Running' });
});

// Helper to parse JSON fields
const parseJsonFields = (rows, fields = []) => {
    return rows.map(row => {
        fields.forEach(field => {
            if (row[field] && typeof row[field] === 'string') {
                try {
                    row[field] = JSON.parse(row[field]);
                } catch (e) {
                    console.error(`Failed to parse ${field}:`, e);
                    row[field] = [];
                }
            }
        });
        return row;
    });
};

// --- Maintenance Requests ---
app.get('/api/maintenance', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM maintenance_requests ORDER BY createdAt DESC');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

app.post('/api/maintenance', async (req, res) => {
    try {
        const { roomId, blockId, reportedBy, description, category, priority, status } = req.body;
        const [result] = await db.query(
            'INSERT INTO maintenance_requests (roomId, blockId, reportedBy, description, category, priority, status, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())',
            [roomId, blockId, reportedBy, description, category, priority, status || 'reported']
        );
        res.status(201).json({ id: result.insertId, ...req.body });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

app.put('/api/maintenance/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
        const values = [...Object.values(updates), id];

        if (!fields) return res.status(400).json({ message: 'No fields' });

        await db.query(`UPDATE maintenance_requests SET ${fields} WHERE id = ?`, values);
        res.json({ message: 'Updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// --- Authentication Endpoints ---
const crypto = require('crypto');

// Removed email functionality

// In-memory storage for OTPs (in production, use Redis or database)
const otpStore = {};

app.post('/api/auth/request-otp', async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }
        
        // Check if student exists in the database
        const [students] = await db.query('SELECT * FROM students WHERE email = ?', [email]);
        
        if (students.length === 0) {
            return res.status(404).json({ message: 'No student found with this email' });
        }
        
        // Generate a 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Store OTP with timestamp (valid for 5 minutes)
        otpStore[email] = {
            otp: otp,
            expiresAt: Date.now() + 5 * 60 * 1000 // 5 minutes
        };
        
        // Send OTP via email
        const mailOptions = {
            from: process.env.EMAIL_USER || 'your-email@gmail.com',
            to: email,
            subject: 'Hostel Management System - Login OTP',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h2 style="color: #8B2318;">Hostel Management System</h2>
                    <h3>Your Login OTP</h3>
                    <p>Hello,</p>
                    <p>Your OTP (One Time Password) for accessing the Hostel Management System is:</p>
                    <div style="text-align: center; margin: 20px 0;">
                        <span style="font-size: 24px; font-weight: bold; padding: 10px 20px; background-color: #f0f0f0; border-radius: 5px; letter-spacing: 3px;">
                            ${otp}
                        </span>
                    </div>
                    <p>This OTP is valid for <strong>5 minutes</strong>. Please use it to complete your login process.</p>
                    <p>If you did not request this OTP, please ignore this email.</p>
                    <br>
                    <p>Best regards,<br>The Hostel Management Team</p>
                </div>
            `
        };
        
        // Log OTP to console for manual delivery
        console.log(`OTP for ${email} is: ${otp}`);
        console.log('Please manually communicate this OTP to the user');
        
        res.json({ message: 'OTP sent successfully', timestamp: new Date() });
        
    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({ message: 'Failed to send OTP. Please try again.' });
    }
});

app.post('/api/auth/verify-otp', async (req, res) => {
    try {
        const { email, otp } = req.body;
        
        if (!email || !otp) {
            return res.status(400).json({ message: 'Email and OTP are required' });
        }
        
        const storedOTP = otpStore[email];
        
        if (!storedOTP) {
            return res.status(400).json({ message: 'No OTP found for this email' });
        }
        
        if (storedOTP.expiresAt < Date.now()) {
            delete otpStore[email]; // Clean up expired OTP
            return res.status(400).json({ message: 'OTP has expired' });
        }
        
        if (storedOTP.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }
        
        // OTP is valid, clean it up
        delete otpStore[email];
        
        // Find student in database
        const [students] = await db.query('SELECT * FROM students WHERE email = ?', [email]);
        
        if (students.length === 0) {
            return res.status(404).json({ message: 'No student found with this email' });
        }
        
        // Generate a temporary token for password reset
        const tempToken = crypto.randomBytes(32).toString('hex');
        
        // Store temp token (in production, use database with expiration)
        // For now, we'll just return success
        
        res.json({ 
            message: 'OTP verified successfully', 
            student: students[0],
            tempToken: tempToken
        });
        
    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/api/auth/create-password', async (req, res) => {
    try {
        const { email, password, tempToken } = req.body;
        
        if (!email || !password || !tempToken) {
            return res.status(400).json({ message: 'Email, password, and tempToken are required' });
        }
        
        // In a real implementation, you'd verify the tempToken
        // For this implementation, we'll proceed after OTP verification
        
        // Hash the password (in production, use bcrypt)
        const hashedPassword = password; // TODO: Implement proper password hashing with bcrypt
        
        // Update the student record with password
        await db.query('UPDATE students SET password = ? WHERE email = ?', [hashedPassword, email]);
        
        res.json({ message: 'Password created successfully' });
        
    } catch (error) {
        console.error('Error creating password:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Endpoint for new account creation - request OTP
app.post('/api/auth/request-new-account-otp', async (req, res) => {
    try {
        const { name, email } = req.body;
        
        if (!name || !email) {
            return res.status(400).json({ message: 'Name and email are required' });
        }
        
        // Check if student already exists
        const [existingStudents] = await db.query('SELECT * FROM students WHERE email = ?', [email]);
        
        if (existingStudents.length > 0) {
            return res.status(409).json({ message: 'An account already exists with this email' });
        }
        
        // Generate a 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Store OTP with timestamp (valid for 5 minutes)
        otpStore[email] = {
            otp: otp,
            expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
            name: name // Store the name for account creation
        };
        
        // Send OTP via email
        const mailOptions = {
            from: process.env.EMAIL_USER || 'your-email@gmail.com',
            to: email,
            subject: 'Hostel Management System - Account Creation OTP',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h2 style="color: #8B2318;">Hostel Management System</h2>
                    <h3>Account Creation OTP</h3>
                    <p>Hello ${name},</p>
                    <p>Thank you for registering with the Hostel Management System. Your OTP (One Time Password) for account creation is:</p>
                    <div style="text-align: center; margin: 20px 0;">
                        <span style="font-size: 24px; font-weight: bold; padding: 10px 20px; background-color: #f0f0f0; border-radius: 5px; letter-spacing: 3px;">
                            ${otp}
                        </span>
                    </div>
                    <p>This OTP is valid for <strong>5 minutes</strong>. Please use it to complete your account creation process.</p>
                    <p>If you did not request this account, please ignore this email.</p>
                    <br>
                    <p>Best regards,<br>The Hostel Management Team</p>
                </div>
            `
        };
        
        // Check if email credentials are properly configured
        if (process.env.EMAIL_USER && process.env.EMAIL_PASS && 
            process.env.EMAIL_USER !== 'your-email@gmail.com' && 
            process.env.EMAIL_PASS !== 'your-app-password') {
            await transporter.sendMail(mailOptions);
            console.log(`Account creation OTP sent via email to ${email}: ${otp}`);
        } else {
            // Fallback: log OTP to console when email is not configured
            console.log(`EMAIL NOT CONFIGURED - Account creation OTP for ${email} is: ${otp}`);
            console.log('To enable email sending, set up real EMAIL_USER and EMAIL_PASS in your .env file');
        }
        
        res.json({ message: 'OTP sent successfully', timestamp: new Date() });
        
    } catch (error) {
        console.error('Error sending account creation OTP:', error);
        res.status(500).json({ message: 'Failed to send OTP. Please try again.' });
    }
});

// Endpoint to verify OTP for new account
app.post('/api/auth/verify-new-account-otp', async (req, res) => {
    try {
        const { email, otp } = req.body;
        
        if (!email || !otp) {
            return res.status(400).json({ message: 'Email and OTP are required' });
        }
        
        const storedData = otpStore[email];
        
        if (!storedData) {
            return res.status(400).json({ message: 'No OTP found for this email. Please request a new OTP.' });
        }
        
        if (storedData.expiresAt < Date.now()) {
            delete otpStore[email]; // Clean up expired OTP
            return res.status(400).json({ message: 'OTP has expired. Please request a new OTP.' });
        }
        
        if (storedData.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP. Please try again.' });
        }
        
        // OTP is valid, keep the data for account creation
        res.json({ 
            message: 'OTP verified successfully', 
            name: storedData.name
        });
        
    } catch (error) {
        console.error('Error verifying account creation OTP:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Endpoint to create new account
app.post('/api/auth/create-account', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Name, email, and password are required' });
        }
        
        // Verify that OTP was previously verified by checking otpStore
        const storedData = otpStore[email];
        if (!storedData) {
            return res.status(400).json({ message: 'Please verify your OTP first' });
        }
        
        // Check if student already exists
        const [existingStudents] = await db.query('SELECT * FROM students WHERE email = ?', [email]);
        
        if (existingStudents.length > 0) {
            return res.status(409).json({ message: 'An account already exists with this email' });
        }
        
        // Create new student account
        // For now, we'll generate a temporary ID
        const newStudentId = `std-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        
        // Hash the password (in production, use bcrypt)
        const hashedPassword = password; // TODO: Implement proper password hashing with bcrypt
        
        // Insert new student into the database
        await db.query(
            'INSERT INTO students (id, name, email, password, status) VALUES (?, ?, ?, ?, ?)',
            [newStudentId, name, email, hashedPassword, 'active']
        );
        
        // Clean up the OTP data
        delete otpStore[email];
        
        res.json({ message: 'Account created successfully' });
        
    } catch (error) {
        console.error('Error creating account:', error);
        res.status(500).json({ message: 'Failed to create account. Please try again.' });
    }
});

// Test email endpoint
app.get('/api/test-email', async (req, res) => {
    try {
        // Check if email credentials are properly configured
        if (process.env.EMAIL_USER && process.env.EMAIL_PASS && 
            process.env.EMAIL_USER !== 'your-email@gmail.com' && 
            process.env.EMAIL_PASS !== 'your-app-password') {
            
            const testMailOptions = {
                from: process.env.EMAIL_USER,
                to: process.env.EMAIL_USER, // Send test email to the same account
                subject: 'Test Email - Hostel Management System',
                html: `<h2>Test Email Success!</h2><p>This confirms that your email configuration is working properly.</p>`
            };
            
            await transporter.sendMail(testMailOptions);
            res.json({ message: 'Test email sent successfully!' });
        } else {
            res.json({ message: 'Email not configured. Please set up EMAIL_USER and EMAIL_PASS in your .env file.' });
        }
    } catch (error) {
        console.error('Error sending test email:', error);
        res.status(500).json({ message: 'Failed to send test email.', error: error.message });
    }
});

// --- Students ---
app.get('/api/students', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT *, DATE_FORMAT(dateOfBirth, "%Y-%m-%d") as dateOfBirth FROM students ORDER BY name');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

app.post('/api/students', async (req, res) => {
    try {
        const s = req.body;
        // Format date properly for MySQL
        let formattedDateOfBirth = null;
        if (s.dateOfBirth) {
            // Convert ISO string to MySQL DATE format
            const dateObj = new Date(s.dateOfBirth);
            formattedDateOfBirth = dateObj.toISOString().split('T')[0]; // YYYY-MM-DD format
        }
        
        // Check if an ID was provided by the frontend
        if (s.id) {
            // If ID provided, use it
            const [result] = await db.query(
                'INSERT INTO students (id, name, email, phone, registrationNumber, department, semester, parentName, parentPhone, parentEmail, parentContact, emergencyContact, emergencyPhone, dateOfBirth, address, city, state, zipCode, password, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [s.id, s.name, s.email, s.phone, s.registrationNumber, s.department, s.semester, s.parentName, s.parentPhone, s.parentEmail, s.parentContact, s.emergencyContact, s.emergencyPhone, formattedDateOfBirth, s.address, s.city, s.state, s.zipCode, s.password || null, s.status || 'active']
            );
            res.status(201).json({ id: s.id, ...s });
        } else {
            // If no ID provided, let database auto-increment
            const [result] = await db.query(
                'INSERT INTO students (name, email, phone, registrationNumber, department, semester, parentName, parentPhone, parentEmail, parentContact, emergencyContact, emergencyPhone, dateOfBirth, address, city, state, zipCode, password, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [s.name, s.email, s.phone, s.registrationNumber, s.department, s.semester, s.parentName, s.parentPhone, s.parentEmail, s.parentContact, s.emergencyContact, s.emergencyPhone, formattedDateOfBirth, s.address, s.city, s.state, s.zipCode, s.password || null, s.status || 'active']
            );
            res.status(201).json({ id: result.insertId, ...s });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

app.put('/api/students/:id', async (req, res) => {
    try {
        const { id } = req.params;
        let updates = { ...req.body };
        // remove id from updates if present
        delete updates.id;
        
        // Format date properly for MySQL if dateOfBirth is being updated
        if (updates.dateOfBirth) {
            // Convert ISO string to MySQL DATE format
            const dateObj = new Date(updates.dateOfBirth);
            updates.dateOfBirth = dateObj.toISOString().split('T')[0]; // YYYY-MM-DD format
        }

        const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
        const values = [...Object.values(updates), id];

        if (!fields) return res.json({ message: 'No changes' });

        await db.query(`UPDATE students SET ${fields} WHERE id = ?`, values);
        res.json({ message: 'Student updated' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

app.delete('/api/students/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM students WHERE id = ?', [req.params.id]);
        res.json({ message: 'Deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// --- Rooms ---
app.get('/api/rooms', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM rooms');
        const parsedContext = parseJsonFields(rows, ['beds']);
        res.json(parsedContext);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

app.post('/api/rooms', async (req, res) => {
    try {
        const r = req.body;
        const bedsJson = JSON.stringify(r.beds || []);
        const [result] = await db.query(
            'INSERT INTO rooms (blockId, roomNumber, floor, type, capacity, occupiedBeds, rentPerMonth, status, beds) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [r.blockId, r.roomNumber, r.floor, r.type, r.capacity, r.occupiedBeds || 0, r.rentPerMonth, r.status || 'available', bedsJson]
        );
        res.status(201).json({ id: result.insertId, ...r });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

app.put('/api/rooms/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updates = { ...req.body };
        delete updates.id;

        if (updates.beds) {
            updates.beds = JSON.stringify(updates.beds);
        }

        const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
        const values = [...Object.values(updates), id];

        if (!fields) return res.json({ message: 'No changes' });

        await db.query(`UPDATE rooms SET ${fields} WHERE id = ?`, values);
        res.json({ message: 'Room updated' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

app.delete('/api/rooms/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM rooms WHERE id = ?', [req.params.id]);
        res.json({ message: 'Deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

app.get('/api/rooms/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM rooms WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ message: 'Not found' });
        const room = parseJsonFields(rows, ['beds'])[0];
        res.json(room);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});


// --- Allocations ---
app.get('/api/allocations', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM allocations ORDER BY allocationDate DESC');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

app.get('/api/allocations/student/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM allocations WHERE studentId = ?', [req.params.id]);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

app.post('/api/allocations', async (req, res) => {
    try {
        const a = req.body;
        const [result] = await db.query(
            'INSERT INTO allocations (studentId, roomId, bedId, blockId, checkInDate, academicYear, semester, status, allocatedBy, allocationDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())',
            [a.studentId, a.roomId, a.bedId, a.blockId, a.checkInDate, a.academicYear, a.semester, a.status || 'active', a.allocatedBy]
        );
        res.status(201).json({ id: result.insertId, ...a });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

app.delete('/api/allocations/:id', async (req, res) => {
    try {
        // Soft delete? Or hard delete. Hard delete for now.
        // Also might need to update room stauts? 
        // Frontend logic does that separately (AdminDashboard calls removeAllocation AND updateRoom).
        // Ideally backend should handle transaction, but sticking to existing pattern.
        await db.query('DELETE FROM allocations WHERE id = ?', [req.params.id]);
        res.json({ message: 'Deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
