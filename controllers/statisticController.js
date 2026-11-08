import { getDBConnection } from '../db/db.js'

export async function recordBattleResult(userId, outcome) {
  if (!userId || !['player_win', 'player_loss', 'draw'].includes(outcome)) {
    return
  }

  const db = await getDBConnection()

  await db.run(
    `INSERT INTO player_statistics (user_id)
     VALUES (?)
     ON CONFLICT(user_id) DO NOTHING`,
    [userId]
  )

  if (outcome === 'player_win') {
    await db.run(`
      UPDATE player_statistics SET
        total_battles = total_battles + 1,
        wins = wins + 1,
        current_win_streak = current_win_streak + 1,
        best_run = MAX(best_run, current_win_streak + 1)
      WHERE user_id = ?
    `, [userId])
  } else if (outcome === 'player_loss') {
    await db.run(`
      UPDATE player_statistics SET
        total_battles = total_battles + 1,
        losses = losses + 1,
        current_win_streak = 0
      WHERE user_id = ?
    `, [userId])
  } else {
    await db.run(`
      UPDATE player_statistics SET
        total_battles = total_battles + 1,
        draws = draws + 1,
        current_win_streak = 0
      WHERE user_id = ?
    `, [userId])
  }
}

export async function getStatistics(req, res) {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Login required.' })
  }

  const db = await getDBConnection()
  const stats = await db.get(`
    SELECT total_battles, wins, losses, draws, best_run
    FROM player_statistics
    WHERE user_id = ?
  `, [req.session.userId])

  res.json(stats || {
    total_battles: 0,
    wins: 0,
    losses: 0,
    draws: 0,
    best_run: 0
  })
}