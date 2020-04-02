const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const pgp = require('pg-promise')()
const db = pgp('postgres://postgres:admin@localhost:5432/postgres')

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
   res.send('Hello World')
})

app.get('/api', (req, res) => {
    let message = {
        message: 'Welcome to Jsonwebtoken'
    }
    res.json(message)
})

app.post('/api/posts', verifyToken,  (req, res) => {
    jwt.verify(req.token, 'office', (err, authToken) => {
        if (err) {
            res.sendStatus(403)
        } else {
            let message = {
                message: 'Post created',
                authToken
            }

            res.json(message)
        }
    })

    
    
})

app.post('/api/login', (req, res) => {
    
        let username = req.body.first_name
        let password = req.body.last_name
        
        db.one('SELECT id, first_name FROM accounts WHERE first_name = $1 AND last_name = $2', [username, password])
            .then(function (data) {
                res.status(200)
                jwt.sign({data}, 'office', { expiresIn: '30s' }, (err, token) => {
                    res.json({
                        token
                    })
                })
            })
            .catch(function (error) {
                res.send(`Error : ${ error } `)
            })

        
})

function verifyToken(req, res, next) {
    const userHeader = req.headers['authorization']

    if (typeof userHeader !== 'undefined') {
        const user = userHeader.split(' ')

        const userToken = user[1]
        
        req.token = userToken

        next()
    } else {
        res.sendStatus(403)
    }
} 








app.get('/api/courses', verifyToken,  (req, res) => {
   
    jwt.verify(req.token, 'office', (err, authToken) => {
        if (err) {
            res.sendStatus(403)
        } else {

            db.any('SELECT * FROM accounts ORDER BY id ASC')
            .then(function (data) {
                res.status(200).json({
                   status: 'success',
                   data: data,
                   message: 'Return objects'
                })
            })
            .catch(function (error) {
                res.send(`Error : ${ error } `)
            })

        }
    })

   
})

app.get('/api/courses/:id', (req, res) => {
    const id = parseInt(req.params.id)

    db.one('SELECT * FROM accounts WHERE id = $1', id)
        .then(function (data) {
            res.status(200).json({
            status: 'success',
            data: data,
            message: 'Return object'
            })
        })
        .catch(function (error) {
            res.send(`Error : ${ error } `)
        })
})

app.post('/api/courses', (req, res) => {
    db.none('INSERT INTO accounts( first_name, last_name) VALUES (${first_name}, ${last_name})', req.body)
        .then(function () {
            res.status(200).json({
                status: 'success',
                message: 'Inserted account'
            })
        })
        .catch(function (error) {
            res.send(`Error : ${ error } `)
        })
})

app.put('/api/courses/:id', (req, res) => {
    db.none('UPDATE accounts SET first_name=$1, last_name=$2 WHERE id =$3 ', [req.body.first_name, req.body.last_name, parseInt(req.params.id)])
        .then(() => {
            res.status(200).json({
                status: 'success',
                massage: 'Updated account'
            })
        })
        .catch((error) => res.send(`Error : ${ error }`))
})

app.delete('/api/courses/:id', (req, res) => {
    const accountId = parseInt(req.params.id)
    db.result('DELETE FROM accounts WHERE id = $1', accountId)
        .then(() => {
            res.status(200).json({
                status: 'success',
                message: 'Deleted account'
            })
        })
        .catch( error => res.send(`Error: ${ error }`) )
})

const port = process.env.PORT || 5000
app.listen(port, () => console.log(`Listening on port ${ port }....`))