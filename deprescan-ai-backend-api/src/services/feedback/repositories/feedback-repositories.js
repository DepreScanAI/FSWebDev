import { Pool } from 'pg';

class FeedbackRepositories {
  constructor() {
    this._pool = new Pool();
  }

  async verifySessionOwner({ sessionId, userId }) {
    const result = await this._pool.query(
      'SELECT id FROM screening_sessions WHERE id = $1 AND user_id = $2',
      [sessionId, userId],
    );
    return result.rows.length > 0;
  }

  async feedbackExists({ userId, sessionId }) {
    const result = await this._pool.query(
      'SELECT id FROM feedbacks WHERE user_id = $1 AND session_id = $2',
      [userId, sessionId],
    );
    return result.rows.length > 0;
  }

  async createFeedback({ sessionId, userId, isHelpful, nameLabel }) {
    const result = await this._pool.query(
      `INSERT INTO feedbacks (session_id, user_id, is_helpful, name_label)
       VALUES ($1, $2, $3, $4)
       RETURNING id, is_helpful, name_label, created_at`,
      [sessionId || null, userId, isHelpful, nameLabel || null],
    );
    return result.rows[0];
  }

  async getFeedbacks() {
    const result = await this._pool.query(
      `SELECT f.id, f.is_helpful, f.name_label, f.created_at,
              s.category, s.phq_score
       FROM feedbacks f
       LEFT JOIN screening_sessions s ON f.session_id = s.id
       ORDER BY f.created_at DESC
       LIMIT 100`,
    );

    const stats = await this._pool.query(
      'SELECT is_helpful, COUNT(*) as count FROM feedbacks GROUP BY is_helpful',
    );

    const total = stats.rows.reduce((sum, r) => sum + parseInt(r.count), 0);
    const helpful = stats.rows.find((r) => r.is_helpful === true);
    const notHelpful = stats.rows.find((r) => r.is_helpful === false);

    return {
      feedbacks: result.rows,
      summary: {
        total,
        helpful: parseInt(helpful?.count || 0),
        not_helpful: parseInt(notHelpful?.count || 0),
        helpful_pct: total > 0
          ? Math.round((parseInt(helpful?.count || 0) / total) * 100)
          : 0,
      },
    };
  }
}

export default new FeedbackRepositories();
