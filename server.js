import express from 'express'
import router from './routes/diceGameRoutes.js'
import {authRouter} from './routes/auth.js'
import session from 'express-session'

const app = express()




const PORT = 8000
// Middleware on session
app.use(session({
    secret:"ameh-sunday",
    resave: false,
    saveUninitialized: false,
    cookie: { 
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
    
    }
}))

app.use(express.json()) // Parse JSON bodies that is comming in from the client
app.use(express.urlencoded({ extended: true })) // Parse form data that is comming in from the client

app.use(express.static('public'))

app.use('/api/auth', authRouter)
app.use('/api', router)




app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
}).on('error', (err) => {
  console.error('Failed to start server:', err)
}) 