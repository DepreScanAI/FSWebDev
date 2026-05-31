import { Pool } from 'pg';

const poolConfig = {
  ssl:
    process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : false,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
};

// arahkan ke PG env vars jika DATABASE_URL tidak ada
if (process.env.DATABASE_URL) {
  poolConfig.connectionString = process.env.DATABASE_URL;
}

const pool = new Pool(poolConfig);

pool.on('connect', () => {
  if (process.env.NODE_ENV !== 'test') {
    console.log('');
    console.log('PostgreSQL connected');
  }
});

pool.on('error', (err) => {
  console.error('PostgreSQL pool error:', err.message);
});

export default pool;
