CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  password_hash VARCHAR(255),
  role VARCHAR(20) CHECK (role IN ('customer', 'driver', 'manager', 'superadmin')) DEFAULT 'customer',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS locations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  total_slots INTEGER DEFAULT 100,
  available_slots INTEGER DEFAULT 100,
  hourly_rate DECIMAL(10, 2) DEFAULT 50.00,
  status VARCHAR(20) CHECK (status IN ('active', 'inactive', 'maintenance')) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS vehicles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  plate_number VARCHAR(50) NOT NULL,
  type VARCHAR(50) CHECK (type IN ('car', 'suv', 'bike', 'other')) DEFAULT 'car',
  owner_name VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS drivers (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20) NOT NULL,
  license_number VARCHAR(100) UNIQUE,
  license_photo_url TEXT,
  status VARCHAR(20) CHECK (status IN ('available', 'busy', 'offline')) DEFAULT 'available',
  site_id INTEGER REFERENCES locations(id),
  joined_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pending_driver_requests (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  license_number VARCHAR(100),
  address TEXT,
  dob DATE,
  license_expiry DATE,
  site_id INTEGER REFERENCES locations(id),
  submitted_by VARCHAR(255),
  submitted_on DATE DEFAULT CURRENT_DATE,
  status VARCHAR(20) CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS parking_sessions (
  id SERIAL PRIMARY KEY,
  ticket_id VARCHAR(50) UNIQUE NOT NULL,
  customer_id INTEGER REFERENCES users(id),
  customer_name VARCHAR(255),
  driver_id INTEGER REFERENCES drivers(id),
  driver_name VARCHAR(255),
  vehicle_id INTEGER REFERENCES vehicles(id),
  vehicle_name VARCHAR(255),
  vehicle_plate VARCHAR(50) NOT NULL,
  location_id INTEGER REFERENCES locations(id),
  location_name VARCHAR(255),
  location_address TEXT,
  status VARCHAR(20) CHECK (status IN ('pending', 'parked', 'retrieving', 'returned', 'cancelled')) DEFAULT 'pending',
  entry_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  exit_time TIMESTAMP WITH TIME ZONE,
  duration VARCHAR(50),
  amount DECIMAL(10, 2) DEFAULT 0.00,
  payment_status VARCHAR(20) CHECK (payment_status IN ('pending', 'paid', 'refunded')) DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_vehicles_user_id ON vehicles(user_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_plate_number ON vehicles(plate_number);
CREATE INDEX IF NOT EXISTS idx_drivers_status ON drivers(status);
CREATE INDEX IF NOT EXISTS idx_drivers_site_id ON drivers(site_id);
CREATE INDEX IF NOT EXISTS idx_parking_sessions_status ON parking_sessions(status);
CREATE INDEX IF NOT EXISTS idx_parking_sessions_customer_id ON parking_sessions(customer_id);
CREATE INDEX IF NOT EXISTS idx_parking_sessions_driver_id ON parking_sessions(driver_id);
CREATE INDEX IF NOT EXISTS idx_parking_sessions_ticket_id ON parking_sessions(ticket_id);
