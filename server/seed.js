const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function seed() {
  try {
    console.log('Seeding database...\n');

    console.log('Clearing existing data...');
    await pool.query(`TRUNCATE TABLE parking_sessions, vehicles, drivers, pending_driver_requests, users, locations RESTART IDENTITY CASCADE;`);
    console.log('Tables cleared\n');

    const locationsResult = await pool.query(`
      INSERT INTO locations (name, address, city, total_slots, available_slots, hourly_rate, updated_at) VALUES
        ('Phoenix Mall', 'Lower Parel', 'Mumbai', 200, 150, 50.00, NOW()),
        ('Central Plaza', 'Andheri West', 'Mumbai', 150, 100, 40.00, NOW()),
        ('Inorbit Mall', 'Malad West', 'Mumbai', 300, 250, 60.00, NOW()),
        ('City Center Mall', 'Bandra East', 'Mumbai', 100, 80, 45.00, NOW())
      RETURNING id, name;
    `);
    console.log('Locations added:', locationsResult.rows.map(r => r.name).join(', '));
    const phoenixMallId = locationsResult.rows.find(r => r.name === 'Phoenix Mall').id;

    const usersResult = await pool.query(`
      INSERT INTO users (name, email, phone, role, updated_at) VALUES
        ('John Doe', 'john@example.com', '+91 98765 43210', 'customer', NOW()),
        ('Admin User', 'admin@smartparking.com', '+91 99999 00000', 'superadmin', NOW()),
        ('Manager User', 'manager@smartparking.com', '+91 88888 00000', 'manager', NOW())
      RETURNING id, name;
    `);
    console.log('Users added:', usersResult.rows.map(r => r.name).join(', '));
    const johnDoeId = usersResult.rows.find(r => r.name === 'John Doe').id;

    await pool.query(`
      INSERT INTO vehicles (user_id, name, plate_number, type, owner_name, updated_at) VALUES
        ($1, 'Toyota Camry', 'MH 12 AB 1234', 'car', 'John Doe', NOW()),
        ($1, 'Honda Civic', 'MH 14 CD 5678', 'car', 'John Doe', NOW());
    `, [johnDoeId]);
    console.log('Vehicles added: Toyota Camry, Honda Civic');

    const driversResult = await pool.query(`
      INSERT INTO drivers (name, email, phone, license_number, status, site_id, updated_at) VALUES
        ('Rajesh Kumar', 'rajesh@valet.com', '+91 98765 43210', 'DL-MH-2022-12345', 'busy', $1, NOW()),
        ('Suresh Patil', 'suresh@valet.com', '+91 98765 43211', 'DL-MH-2023-67890', 'available', $1, NOW()),
        ('Vikram Singh', 'vikram@valet.com', '+91 98765 43212', 'DL-MH-2023-11111', 'available', $1, NOW()),
        ('Mohan Reddy', 'mohan@valet.com', '+91 98765 43213', 'DL-MH-2024-22222', 'busy', $1, NOW()),
        ('Arjun Nair', 'arjun@valet.com', '+91 98765 43214', 'DL-MH-2024-33333', 'available', $1, NOW())
      RETURNING id, name;
    `, [phoenixMallId]);
    console.log('Drivers added:', driversResult.rows.map(r => r.name).join(', '));

    const driverIds = {};
    driversResult.rows.forEach(r => { driverIds[r.name] = r.id; });

    await pool.query(`
      INSERT INTO parking_sessions (ticket_id, customer_name, driver_id, driver_name, vehicle_name, vehicle_plate, location_id, location_name, location_address, status, entry_time, amount, payment_status, updated_at) VALUES
        ('PKG-1234', 'Amit Sharma', $1, 'Rajesh Kumar', 'Honda City', 'MH02AB1234', $6, 'Phoenix Mall', 'Lower Parel, Mumbai', 'parked', NOW() - INTERVAL '2 hours', 150.00, 'paid', NOW()),
        ('PKG-1235', 'Priya Patel', $2, 'Suresh Patil', 'Maruti Swift', 'MH04CD5678', $6, 'Phoenix Mall', 'Lower Parel, Mumbai', 'parked', NOW() - INTERVAL '3 hours 15 minutes', 200.00, 'paid', NOW()),
        ('PKG-1236', 'Rahul Verma', $3, 'Vikram Singh', 'Hyundai Creta', 'MH01EF9012', $6, 'Phoenix Mall', 'Lower Parel, Mumbai', 'retrieving', NOW() - INTERVAL '4 hours 45 minutes', 250.00, 'pending', NOW()),
        ('PKG-1237', 'Neha Gupta', $4, 'Mohan Reddy', 'Toyota Innova', 'MH12GH3456', $6, 'Phoenix Mall', 'Lower Parel, Mumbai', 'parked', NOW() - INTERVAL '1 hour 30 minutes', 100.00, 'paid', NOW()),
        ('PKG-1238', 'Vikash Singh', $5, 'Arjun Nair', 'Tata Nexon', 'MH03IJ7890', $6, 'Phoenix Mall', 'Lower Parel, Mumbai', 'returned', NOW() - INTERVAL '5 hours 45 minutes', 300.00, 'paid', NOW());
    `, [
      driverIds['Rajesh Kumar'],
      driverIds['Suresh Patil'],
      driverIds['Vikram Singh'],
      driverIds['Mohan Reddy'],
      driverIds['Arjun Nair'],
      phoenixMallId
    ]);
    console.log('Parking sessions added: 5 sessions');

    console.log('\n✅ Seeding completed successfully!');
  } catch (err) {
    console.error('Seed error:', err.message);
  } finally {
    await pool.end();
  }
}

seed();
