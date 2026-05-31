import { Pool } from 'pg';
import { nanoid } from 'nanoid';

class ScreeningRepositories {
  constructor() {
    this._pool = new Pool();
  }

  generateSessionCode() {
    const now = new Date();
    const date = now.toISOString().slice(0, 10).replace(/-/g, '');
    const time = now.toISOString().slice(11, 19).replace(/:/g, '');
    return `${date}_${time}_${nanoid(6)}`;
  }

  async createSession({ userId, nameLabel, prediction, inputData }) {
    const session_code = this.generateSessionCode();

    const result = await this._pool.query(
      `INSERT INTO screening_sessions
         (user_id, session_code, name_label, phq_score, phq_score_int, category,
          confidence_band, disclaimer, ai_insight, input_data)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING id, session_code, category, phq_score, phq_score_int, created_at`,
      [
        userId,
        session_code,
        nameLabel,
        prediction.phq_score,
        prediction.phq_score_int ?? Math.round(prediction.phq_score),
        prediction.category,
        prediction.confidence_band || null,
        prediction.disclaimer || null,
        prediction.ai_insight || null,
        JSON.stringify(inputData),
      ],
    );

    return result.rows[0];
  }

  async getSessions({ userId, page, limit }) {
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const result = await this._pool.query(
      `SELECT id, session_code, name_label, phq_score, phq_score_int, category,
              confidence_band, ai_insight, created_at
       FROM screening_sessions
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [userId, parseInt(limit), offset],
    );

    const countResult = await this._pool.query(
      'SELECT COUNT(*) FROM screening_sessions WHERE user_id = $1',
      [userId],
    );

    return {
      sessions: result.rows,
      total: parseInt(countResult.rows[0].count),
    };
  }

  async getSessionById({ id, userId }) {
    const result = await this._pool.query(
      'SELECT * FROM screening_sessions WHERE id = $1 AND user_id = $2',
      [id, userId],
    );
    return result.rows[0] || null;
  }

  async getSessionByCode({ sessionCode, userId }) {
    const result = await this._pool.query(
      'SELECT * FROM screening_sessions WHERE session_code = $1 AND user_id = $2',
      [sessionCode, userId],
    );
    return result.rows[0] || null;
  }

  async deleteSession({ id, userId }) {
    const result = await this._pool.query(
      'DELETE FROM screening_sessions WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, userId],
    );
    return result.rows[0] || null;
  }

  async deleteAllSessions(userId) {
    const result = await this._pool.query(
      'DELETE FROM screening_sessions WHERE user_id = $1 RETURNING id',
      [userId],
    );
    return result.rowCount;
  }

  // method perbarui update ai insight
  async updateAiInsight({ id, userId, aiInsight }) {
    const result = await this._pool.query(
      `UPDATE screening_sessions
       SET ai_insight = $1
       WHERE id = $2 AND user_id = $3
       RETURNING id, session_code, ai_insight`,
      [aiInsight, id, userId],
    );
    return result.rows[0] || null;
  }
}

export default new ScreeningRepositories();
