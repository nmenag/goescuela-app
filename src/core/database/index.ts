import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';

import schema from './schema';
// import migrations from './migrations' // TODO

const adapter = new SQLiteAdapter({
  schema,
  // migrations,
  dbName: 'goescuela_db',
  jsi: true, // Performance boost
  onSetUpError: (error) => {
    console.error('Database failed to load', error);
  },
});

export const database = new Database({
  adapter,
  modelClasses: [
    // Models will be added here
  ],
});
