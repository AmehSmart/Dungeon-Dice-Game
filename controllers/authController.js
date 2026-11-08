import { getDBConnection } from '../db/db.js'
import bcrypt from 'bcryptjs'

export async function registerUser(req, res) {
    const db = await getDBConnection()

    let { name, username, password } = req.body
    if(!name || !username || !password) {
        return res.status(400).json({ error: 'All fields are required' })
    }
    name = name.trim()
    username = username.trim()
    
   let usernameRegex = /^[a-zA-Z0-9_-]{1,20}$/

    if(!usernameRegex.test(username)) {
        return res.status(400).json({ error: 'Username must be 3-20 characters long and can only contain letters, numbers, and underscores' })
    }

    try{
        const existingUsername = await db.get(
            'SELECT * FROM users WHERE username = ?',
            [ username]
        )
        
    
        if(existingUsername){
             return res.status(400).json({ error: 'username already registered' })
        }
        
        password = await bcrypt.hash(password, 10)
        const result = await db.run(
            'INSERT INTO users (name, username, password) VALUES (?, ?, ?)',
            [name, username, password]
        )
        // console.log('User registered with ID:', result.lastID)
        req.session.userId = result.lastID

        res.status(201).json({ message: 'User registered successfully' })

    }catch(err){
    console.error('Registration error:', err.message);
    res.status(500).json({ error: 'Registration failed. Please try again.' })

    }
    // console.log('registerUser called with body:', req.body)
}

// ===== New loginUser function =====
export async function loginUser(req, res){
    // grab the username and password from the request body
    let { username, password } = req.body
    // check if the username and password are provided
    if( !username  || !password) {
        return res.status(400).json({ error: 'All fields are required' })
    }
    username = username.trim()

        try{
              // connect to the database
    const db = await getDBConnection()
    
    // check if the user exists in the database
 const existingUser = await db.get(
            'SELECT * FROM users WHERE username = ?',
            [username]
        )
        // if the user does not exist, return an error
        if(!existingUser) {
            return res.status(400).json({ error: 'Invalid credentials' })
        }
        // compare the provided password with the hashed password in the database
        const passwordMatch = await bcrypt.compare(password, existingUser.password)
// if the password does not match, return an error  
        if(!passwordMatch) {
            return res.status(400).json({ error: 'Invalid credentials' })
        }
      // if the user exists and the password matches, create a session for the user
        req.session.userId = existingUser.id
        // return a success message
        return res.status(200).json({ message: 'Logged in' })
        } catch(err){
             console.error('Login error:', err.message)
            res.status(500).json({ error: 'Login failed. Please try again.' })
        }


    
}



export async function logoutUser(req, res) {
    req.session.destroy((err) => {
        if (err) {
            console.error('Logout error:', err.message)
            return res.status(500).json({ error: 'Logout failed. Please try again.' })
        }
        return res.status(200).json({ message: 'Logged out' })
    })
}