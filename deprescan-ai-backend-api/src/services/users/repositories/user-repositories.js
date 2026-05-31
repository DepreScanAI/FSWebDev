import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

class UserRepositories {
  constructor() {
    this._pool = new Pool();
  }

  async createUser({ name, email, password, avatarUrl }) {
    const password_hash = await bcrypt.hash(password, 12);
    const result = await this._pool.query(
      `INSERT INTO users (name, email, password_hash, avatar_url, provider, is_verified)
       VALUES ($1, $2, $3, $4, 'local', false)
       RETURNING id, name, email, avatar_url, provider, created_at`,
      [name.trim(), email, password_hash, avatarUrl],
    );
    return result.rows[0];
  }

  async verifyEmail(email) {
    const result = await this._pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email],
    );
    return result.rows.length > 0;
  }

  async getUserById(id) {
    const result = await this._pool.query(
      'SELECT id, name, email, avatar_url, provider FROM users WHERE id = $1',
      [id],
    );
    return result.rows[0] || null;
  }

  async getUserByEmailForAuth(email) {
    const result = await this._pool.query(
      'SELECT id, name, email, password_hash, avatar_url, provider FROM users WHERE email = $1',
      [email],
    );
    return result.rows[0] || null;
  }

  async getUserByGoogleIdOrEmail(googleId, email) {
    const result = await this._pool.query(
      'SELECT * FROM users WHERE google_id = $1 OR email = $2',
      [googleId, email],
    );
    return result.rows[0] || null;
  }

  async upsertGoogleUser({ googleId, avatarUrl, name, existingId }) {
    const result = await this._pool.query(
      `UPDATE users
       SET google_id = $1, avatar_url = $2, name = COALESCE(name, $3), provider = 'google', updated_at = NOW()
       WHERE id = $4
       RETURNING id, name, email, avatar_url, provider`,
      [googleId, avatarUrl, name, existingId],
    );
    return result.rows[0];
  }

  async insertGoogleUser({ name, email, googleId, avatarUrl }) {
    const result = await this._pool.query(
      `INSERT INTO users (name, email, google_id, avatar_url, provider, is_verified)
       VALUES ($1, $2, $3, $4, 'google', true)
       RETURNING id, name, email, avatar_url, provider`,
      [name, email, googleId, avatarUrl],
    );
    return result.rows[0];
  }

  async updateName({ id, name }) {
    const result = await this._pool.query(
      `UPDATE users SET name = $1, updated_at = NOW() WHERE id = $2
       RETURNING id, name, email, avatar_url, provider`,
      [name.trim(), id],
    );
    return result.rows[0];
  }

  async verifyCredential(email, password) {
    const user = await this.getUserByEmailForAuth(email);
    if (!user) return null;

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return null;

    return user;
  }

  async updatePassword({ userId, password, client }) {
    const password_hash = await bcrypt.hash(password, 12);
    const q = client || this._pool;
    await q.query(
      'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2',
      [password_hash, userId],
    );
  }

  get pool() {
    return this._pool;
  }
}

export default new UserRepositories();
