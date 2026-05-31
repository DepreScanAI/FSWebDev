/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
export const up = (pgm) => {
  pgm.createTable('screening_sessions', {
    id: {
      type: 'UUID',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    user_id: {
      type: 'UUID',
      references: '"users"(id)',
      onDelete: 'CASCADE',
    },
    session_code: {
      type: 'VARCHAR(100)',
      notNull: true,
      unique: true,
    },
    name_label: {
      type: 'VARCHAR(255)',
      default: "'Anonim'",
    },
    phq_score: {
      type: 'NUMERIC(5,2)',
      notNull: true,
    },
    phq_score_int: {
      type: 'INTEGER',
      notNull: true,
    },
    category: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    confidence_band: {
      type: 'VARCHAR(50)',
    },
    disclaimer: {
      type: 'TEXT',
    },
    ai_insight: {
      type: 'TEXT',
    },
    input_data: {
      type: 'JSONB',
    },
    created_at: {
      type: 'TIMESTAMPTZ',
      default: pgm.func('NOW()'),
    },
  });

  pgm.createIndex('screening_sessions', 'user_id', { name: 'idx_sessions_user_id' });
  pgm.createIndex('screening_sessions', 'created_at', {
    name: 'idx_sessions_created_at',
    order: { created_at: 'DESC' },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
export const down = (pgm) => {
  pgm.dropIndex('screening_sessions', 'created_at', { name: 'idx_sessions_created_at', ifExists: true });
  pgm.dropIndex('screening_sessions', 'user_id', { name: 'idx_sessions_user_id', ifExists: true });
  pgm.dropTable('screening_sessions');
};
