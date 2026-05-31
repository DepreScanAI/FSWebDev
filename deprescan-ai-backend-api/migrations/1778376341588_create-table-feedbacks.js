/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
export const up = (pgm) => {
  pgm.createTable('feedbacks', {
    id: {
      type: 'UUID',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    session_id: {
      type: 'UUID',
      references: '"screening_sessions"(id)',
      onDelete: 'SET NULL',
    },
    user_id: {
      type: 'UUID',
      references: '"users"(id)',
      onDelete: 'SET NULL',
    },
    is_helpful: {
      type: 'BOOLEAN',
      notNull: true,
    },
    name_label: {
      type: 'VARCHAR(255)',
    },
    created_at: {
      type: 'TIMESTAMPTZ',
      default: pgm.func('NOW()'),
    },
  });

  pgm.createIndex('feedbacks', 'session_id', { name: 'idx_feedbacks_session_id' });

  // Satu feedback per user per sesi (hanya jika session_id tidak null)
  pgm.sql(`
    CREATE UNIQUE INDEX idx_feedbacks_user_session_unique
    ON feedbacks(user_id, session_id)
    WHERE session_id IS NOT NULL;
  `);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
export const down = (pgm) => {
  pgm.dropIndex('feedbacks', 'session_id', { name: 'idx_feedbacks_session_id', ifExists: true });
  pgm.sql('DROP INDEX IF EXISTS idx_feedbacks_user_session_unique;');
  pgm.dropTable('feedbacks');
};
