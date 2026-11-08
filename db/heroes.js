import { getDBConnection } from './db.js';

export async function getAllHeroes() {
  const db = await getDBConnection();

  return db.all(
    'SELECT * FROM heroes',
  );
}