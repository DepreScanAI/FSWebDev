import { Pool } from 'pg';
import crypto from 'crypto';

class AuthenticationRepositories {
  constructor() {
    this._pool = new Pool();
  }

  async invalidateOldResetTokens(userId) {
    await this._pool.query(
      `UPDATE password_reset_tokens SET used_at = NOW()
       WHERE user_id = $1 AND used_at IS NULL`,
      [userId],
    );
  }

  async createResetToken(userId) {
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 jam

    await this._pool.query(
      `INSERT INTO password_reset_tokens (user_id, token, expires_at)
       VALUES ($1, $2, $3)`,
      [userId, token, expiresAt],
    );

    return token;
  }

  async getValidResetToken(token) {
    const result = await this._pool.query(
      `SELECT prt.id, prt.user_id, u.name, u.email, u.provider
       FROM password_reset_tokens prt
       JOIN users u ON u.id = prt.user_id
       WHERE prt.token = $1
         AND prt.used_at IS NULL
         AND prt.expires_at > NOW()`,
      [token],
    );
    return result.rows[0] || null;
  }

  async verifyResetTokenExists(token) {
    const result = await this._pool.query(
      `SELECT id FROM password_reset_tokens
       WHERE token = $1 AND used_at IS NULL AND expires_at > NOW()`,
      [token],
    );
    return result.rows.length > 0;
  }

  async markResetTokenUsed(tokenId) {
    await this._pool.query(
      'UPDATE password_reset_tokens SET used_at = NOW() WHERE id = $1',
      [tokenId],
    );
  }

  get pool() {
    return this._pool;
  }
}

export default new AuthenticationRepositories();
