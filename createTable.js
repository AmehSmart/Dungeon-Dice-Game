import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import path from 'node:path'

async function createTable() {
    const db = await open({
        filename : path.join('database.db'),
        driver : sqlite3.Database
    }) 

    await db.exec(
          
        `

     CREATE TABLE IF NOT EXISTS heroes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        attackPower INTEGER NOT NULL,
        defensePower INTEGER NOT NULL,
        maxHp INTEGER NOT NULL,
        imageUrl TEXT NOT NULL
        );
        `
    )

    
    await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`)

await db.exec(`
    CREATE TABLE IF NOT EXISTS player_statistics (
    user_id INTEGER PRIMARY KEY,
    total_battles INTEGER NOT NULL DEFAULT 0,
    wins INTEGER NOT NULL DEFAULT 0,
    losses INTEGER NOT NULL DEFAULT 0,
    draws INTEGER NOT NULL DEFAULT 0,
    current_win_streak INTEGER NOT NULL DEFAULT 0,
    best_run INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
    
    `

)
 
}

createTable()