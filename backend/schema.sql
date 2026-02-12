CREATE DATABASE IF NOT EXISTS hostel_cms;
USE hostel_cms;

-- Drop tables for clean slate (dev mode)
DROP TABLE IF EXISTS allocations;
DROP TABLE IF EXISTS maintenance_requests;
DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS rooms;

CREATE TABLE IF NOT EXISTS maintenance_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    roomId VARCHAR(255) NOT NULL,
    blockId VARCHAR(255) NOT NULL,
    reportedBy VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    priority VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'reported',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    assignedTo VARCHAR(255),
    estimatedCompletionDate DATETIME,
    completedAt DATETIME,
    notes TEXT
);

CREATE TABLE IF NOT EXISTS students (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(50),
    registrationNumber VARCHAR(50) NOT NULL UNIQUE,
    department VARCHAR(100),
    semester INT,
    parentContact VARCHAR(50),
    parentName VARCHAR(255),
    parentPhone VARCHAR(50),
    parentEmail VARCHAR(255),
    emergencyContact VARCHAR(255),
    emergencyPhone VARCHAR(50),
    dateOfBirth DATE,
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    zipCode VARCHAR(20),
    avatar VARCHAR(255),
    password VARCHAR(255),
    status VARCHAR(50) DEFAULT 'active'
);

CREATE TABLE IF NOT EXISTS rooms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    blockId VARCHAR(50) NOT NULL,
    roomNumber VARCHAR(50) NOT NULL,
    floor INT NOT NULL,
    type VARCHAR(50) NOT NULL,
    capacity INT NOT NULL,
    occupiedBeds INT DEFAULT 0,
    rentPerMonth DECIMAL(10, 2),
    status VARCHAR(50) DEFAULT 'available',
    maintenanceStatus VARCHAR(50),
    lastCleaned DATETIME,
    image VARCHAR(255),
    beds JSON
);

CREATE TABLE IF NOT EXISTS allocations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    studentId VARCHAR(50) NOT NULL,
    roomId INT NOT NULL,
    bedId VARCHAR(255) NOT NULL,
    blockId VARCHAR(255),
    checkInDate DATETIME,
    academicYear VARCHAR(50),
    semester INT,
    status VARCHAR(50) DEFAULT 'active',
    allocationDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    allocatedBy VARCHAR(255),
    FOREIGN KEY (studentId) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (roomId) REFERENCES rooms(id) ON DELETE CASCADE
);
