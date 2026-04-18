const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const db = require('./config/db');
const crypto = require('crypto');

const emailjs = require('@emailjs/nodejs');

const app = express();
const PORT = process.env.PORT || 3000;

// Email Configuration (EmailJS Node.js SDK)
const sendEmail = async (toEmail, userName, otpCode, isRegistration = false) => {
    try {
        const templateParams = {
            to_email: toEmail,
            user_name: userName || 'User',
            otp: otpCode,
            subject: isRegistration ? 'Account Creation OTP' : 'Verification OTP'
        };

        await emailjs.send(
            process.env.EMAILJS_SERVICE_ID,
            process.env.EMAILJS_TEMPLATE_ID,
            templateParams,
            {
                publicKey: process.env.EMAILJS_PUBLIC_KEY,
                privateKey: process.env.EMAILJS_PRIVATE_KEY
            }
        );

        console.log(`Email sent successfully via EmailJS to ${toEmail}: ${otpCode}`);
        return true;
    } catch (error) {
        console.error('Error sending email via EmailJS:', error.text || error.message || error);
        console.log(`FALLBACK - OTP for ${toEmail} is: ${otpCode}`);
        return false;
    }
};

// Notification for Admin about new complaints
const sendComplaintNotification = async (complaint) => {
    try {
        const templateParams = {
            to_email: process.env.EMAIL_USER || 'cutmhostelmanagement@gmail.com', // Admin Email
            student_name: complaint.studentName || 'A student',
            complaint_title: complaint.title,
            complaint_category: complaint.category,
            priority: complaint.priority,
            description: complaint.description,
            email: complaint.studentEmail || 'noreply@hostel.com' // For reply-to
        };

        await emailjs.send(
            process.env.EMAILJS_SERVICE_ID,
            process.env.EMAILJS_COMPLAINT_TEMPLATE_ID || 'template_2dhoxg1', // Dedicated complaint template
            templateParams,
            {
                publicKey: process.env.EMAILJS_PUBLIC_KEY,
                privateKey: process.env.EMAILJS_PRIVATE_KEY
            }
        );

        console.log(`Complaint notification sent to admin for: ${complaint.title}`);
        return true;
    } catch (error) {
        console.error('Error sending complaint notification:', error.text || error.message || error);
        return false;
    }
};

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
        await sendEmail(email, students[0].name, otp, false);

        res.json({ message: 'OTP sent successfully', timestamp: new Date() });

    } catch (error) {
        console.error('Error in request-otp:', error);
        res.status(500).json({ message: 'Failed to process OTP request.' });
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

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Find student in database
        const [students] = await db.query('SELECT * FROM students WHERE email = ?', [email]);

        if (students.length === 0) {
            return res.status(404).json({ message: 'No student found with this email' });
        }

        const student = students[0];

        // Check password (TODO: use bcrypt.compare)
        if (student.password !== password) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        // Success
        res.json({
            message: 'Login successful',
            student: {
                id: student.id,
                name: student.name,
                email: student.email,
                role: 'student'
            }
        });

    } catch (error) {
        console.error('Error during student login:', error);
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
        await sendEmail(email, name, otp, true);

        res.json({ message: 'OTP sent successfully', timestamp: new Date() });

    } catch (error) {
        console.error('Error in request-new-account-otp:', error);
        res.status(500).json({ message: 'Failed to process account creation OTP.' });
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

// --- Forgot Password Flow ---

// 1. Request OTP for Forgot Password
app.post('/api/auth/forgot-password-request-otp', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        // Check if student exists
        const [students] = await db.query('SELECT * FROM students WHERE email = ?', [email]);

        if (students.length === 0) {
            return res.status(404).json({ message: 'No student found with this email' });
        }

        // Generate a 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Store OTP with timestamp (valid for 5 minutes)
        otpStore[email] = {
            otp: otp,
            expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
            type: 'forgot-password'
        };

        // Send OTP via email
        await sendEmail(email, students[0].name, otp, false);

        res.json({ message: 'Reset OTP sent successfully' });

    } catch (error) {
        console.error('Error in forgot-password-request-otp:', error);
        res.status(500).json({ message: 'Failed to process password reset request.' });
    }
});

// 2. Verify OTP for Forgot Password
app.post('/api/auth/forgot-password-verify-otp', async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ message: 'Email and OTP are required' });
        }

        const storedData = otpStore[email];

        if (!storedData || storedData.type !== 'forgot-password') {
            return res.status(400).json({ message: 'No reset request found for this email.' });
        }

        if (storedData.expiresAt < Date.now()) {
            delete otpStore[email];
            return res.status(400).json({ message: 'OTP has expired.' });
        }

        if (storedData.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP.' });
        }

        // Generate a temporary token for password reset completion
        const resetToken = crypto.randomBytes(32).toString('hex');

        // Update stored data to include the reset token
        otpStore[email].resetToken = resetToken;
        otpStore[email].verified = true;

        res.json({
            message: 'OTP verified successfully',
            resetToken: resetToken
        });

    } catch (error) {
        console.error('Error verifying forgot-password OTP:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// 3. Reset Password
app.post('/api/auth/forgot-password-reset', async (req, res) => {
    try {
        const { email, resetToken, newPassword } = req.body;

        if (!email || !resetToken || !newPassword) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        const storedData = otpStore[email];

        if (!storedData || storedData.resetToken !== resetToken || !storedData.verified) {
            return res.status(400).json({ message: 'Unauthorized password reset attempt.' });
        }

        // Update password in database (TODO: bcrypt)
        await db.query('UPDATE students SET password = ? WHERE email = ?', [newPassword, email]);

        // Clean up store
        delete otpStore[email];

        res.json({ message: 'Password reset successful. You can now login with your new password.' });

    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ message: 'Failed to reset password.' });
    }
});

// Test email endpoint
app.get('/api/test-email', async (req, res) => {
    try {
        const success = await sendEmail(process.env.EMAIL_USER, 'Admin', '123456', false);
        if (success) {
            res.json({ message: 'Test email sent successfully via EmailJS!' });
        } else {
            res.json({ message: 'Failed to send test email. Check console for details.' });
        }
    } catch (error) {
        console.error('Error sending test email:', error);
        res.status(500).json({ message: 'Failed to send test email.', error: error.message });
    }
});

// --- Forgot Password Endpoints ---

// Endpoint to request OTP for forgot password
app.post('/api/auth/forgot-password-request-otp', async (req, res) => {
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
        otpStore[`reset_${email}`] = {
            otp: otp,
            expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
            email: email
        };

        // Send OTP via email
        await sendEmail(email, students[0].name, otp, false, 'reset');

        res.json({ message: 'OTP sent successfully to your email', timestamp: new Date() });

    } catch (error) {
        console.error('Error in forgot-password-request-otp:', error);
        res.status(500).json({ message: 'Failed to send OTP. Please try again.' });
    }
});

// Endpoint to verify OTP for forgot password
app.post('/api/auth/forgot-password-verify-otp', async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ message: 'Email and OTP are required' });
        }

        const storedData = otpStore[`reset_${email}`];

        if (!storedData) {
            return res.status(400).json({ message: 'No OTP found for this email. Please request a new OTP.' });
        }

        if (storedData.expiresAt < Date.now()) {
            delete otpStore[`reset_${email}`]; // Clean up expired OTP
            return res.status(400).json({ message: 'OTP has expired. Please request a new OTP.' });
        }

        if (storedData.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP. Please try again.' });
        }

        // Generate a reset token
        const resetToken = crypto.randomBytes(32).toString('hex');

        // Store reset token (valid for 10 minutes)
        otpStore[`resetToken_${email}`] = {
            token: resetToken,
            expiresAt: Date.now() + 10 * 60 * 1000
        };

        // Clean up OTP
        delete otpStore[`reset_${email}`];

        res.json({
            message: 'OTP verified successfully',
            resetToken: resetToken
        });

    } catch (error) {
        console.error('Error verifying forgot password OTP:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Endpoint to reset password
app.post('/api/auth/forgot-password-reset', async (req, res) => {
    try {
        const { email, resetToken, newPassword } = req.body;

        if (!email || !resetToken || !newPassword) {
            return res.status(400).json({ message: 'Email, reset token, and new password are required' });
        }

        const storedToken = otpStore[`resetToken_${email}`];

        if (!storedToken) {
            return res.status(400).json({ message: 'Invalid or expired reset token' });
        }

        if (storedToken.expiresAt < Date.now()) {
            delete otpStore[`resetToken_${email}`];
            return res.status(400).json({ message: 'Reset token has expired' });
        }

        if (storedToken.token !== resetToken) {
            return res.status(400).json({ message: 'Invalid reset token' });
        }

        // Update password in database
        await db.query('UPDATE students SET password = ? WHERE email = ?', [newPassword, email]);

        // Clean up reset token
        delete otpStore[`resetToken_${email}`];

        res.json({ message: 'Password reset successfully' });

    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// --- End Forgot Password Endpoints ---

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

        await db.query(`UPDATE students SET ${fields} WHERE id = ? `, values);
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

        await db.query(`UPDATE rooms SET ${fields} WHERE id = ? `, values);
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

// --- Complaints ---
app.get('/api/complaints', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM complaints ORDER BY createdAt DESC');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

app.post('/api/complaints', async (req, res) => {
    try {
        const c = req.body;
        await db.query(
            'INSERT INTO complaints (id, studentId, studentName, roomId, blockId, type, category, title, description, priority, status, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())',
            [c.id, c.studentId, c.studentName || null, c.roomId || null, c.blockId || null, c.type, c.category, c.title, c.description, c.priority, c.status || 'submitted']
        );

        // Notify Admin via EmailJS
        sendComplaintNotification(c).catch(err => console.error('Silent failure in complaint notification:', err));

        res.status(201).json({ message: 'Complaint created successfully', ...c });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.put('/api/complaints/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updates = { ...req.body };
        // remove fields that shouldn't be updated or cause issues
        delete updates.id;
        delete updates.createdAt;

        // Ensure updatedAt is handled by DB if possible, or set it here
        updates.updatedAt = new Date();

        const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
        const values = [...Object.values(updates), id];

        if (!fields) return res.status(400).json({ message: 'No fields to update' });

        await db.query(`UPDATE complaints SET ${fields} WHERE id = ?`, values);
        res.json({ message: 'Complaint updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

app.delete('/api/complaints/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM complaints WHERE id = ?', [req.params.id]);
        res.json({ message: 'Complaint deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} `);
});
