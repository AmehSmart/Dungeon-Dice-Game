

import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import path from 'node:path'
import { heroes } from './data/heroes.js'

async function seedTable() {
 
  const db = await open({
    filename: path.join('database.db'),
    driver: sqlite3.Database
  })

 
  try {
    await db.exec('BEGIN TRANSACTION')
//       {
//     id: 1,
//     name: "Knight of Ashfang",
//     attackPower: 10,
//     defensePower: 6,
//     maxHp: 18,
//     imageUrl:
//       "https://images.unsplash.com/photo-1577493340887-b7bfff550145?auto=format&fit=crop&crop=top&w=500&h=400&q=80"
//   },
    for ( const {id, name, attackPower, defensePower,  maxHp, imageUrl} of heroes) {
        await db.run(
            `INSERT INTO heroes (id, name, attackPower, defensePower,  maxHp, imageUrl)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [id, name, attackPower, defensePower, maxHp, imageUrl]
        )
    }
    await db.exec('COMMIT')
    console.log('All records inserted successfully.')
  } catch (err) {
    await db.exec('ROLLBACK')
    console.error('Error inserting data:', err.message)
  } finally {
    await db.close()
    console.log('Database connection closed.')
  }
}

seedTable()