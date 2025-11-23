-- SQL Seed Data for HRMS

-- Inserting initial users
INSERT INTO users (organisation_name, password, email) VALUES 
('Tech Corp', '$2b$10$EIXZ1Q9Z5g5Z1Z5g5Z1Z5Oe1Z5g5Z1Z5g5Z1Z5g5Z1Z5g5Z5g5Z5', 'admin@techcorp.com'),
('Business Inc', '$2b$10$EIXZ1Q9Z5g5Z1Z5g5Z1Z5Oe1Z5g5Z1Z5g5Z1Z5g5Z1Z5g5Z5g5Z5', 'admin@businessinc.com');

-- Inserting initial employees
INSERT INTO employees (name, position, department) VALUES 
('John Doe', 'Software Engineer', 'Development'),
('Jane Smith', 'Project Manager', 'Management'),
('Emily Johnson', 'HR Specialist', 'Human Resources');

-- Inserting initial teams
INSERT INTO teams (name, lead) VALUES 
('Development Team', 'John Doe'),
('Management Team', 'Jane Smith');