import { getDBConnection } from '../db/db.js'

export async function getCurrentUser(req, res) {
const db = await getDBConnection()
try{

if(!req.session.userId) {
  return res.json({ isLoggedIn: false })
} else {
  // Connect to the DB and get the user's name
    const user = await db.get('SELECT name FROM users WHERE id = ?', [req.session.userId])
    res.json({ isLoggedIn: true, name: user.name })
}
}catch(err){
    console.error('Error fetching user data:', err)
    res.status(500).json({ error: 'Failed to fetch user data' })    
}

}