/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
export const up = (pgm) => {
  pgm.createTable('users', {
    id: {
      type: 'UUID',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    name: {
      type: 'VARCHAR(255)',
    },
    email: {
      type: 'VARCHAR(255)',
      notNull: true,
      unique: true,
    },
    password_hash: {
      type: 'VARCHAR(255)',
    },
    google_id: {
      type: 'VARCHAR(255)',
      unique: true,
    },
    avatar_url: {
      type: 'TEXT',
    },
    provider: {
      type: 'VARCHAR(50)',
      default: "'local'",
    },
    is_verified: {
      type: 'BOOLEAN',
      default: false,
    },
    created_at: {
      type: 'TIMESTAMPTZ',
      default: pgm.func('NOW()'),
    },
    updated_at: {
      type: 'TIMESTAMPTZ',
      default: pgm.func('NOW()'),
    },
  });

  pgm.createIndex('users', 'email', { name: 'idx_users_email' });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
export const down = (pgm) => {
  pgm.dropIndex('users', 'email', { name: 'idx_users_email', ifExists: true });
  pgm.dropTable('users');
};
