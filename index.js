const express = require('express')
const pgp = require('pg-promise')()
const db = pgp('postgres://postgres:admin@localhost:5432/postgres')

const app = express()

app.use(express.json())

const courses = [
    {   id: 1, name: 'course1' },
    {   id: 2, name: 'couese2' },
]

app.get('/', (req, res) => {
   res.send('Hello World')
})

app.get('/api/courses', (req, res) => {
    db.any('SELECT * FROM accounts')
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
})

app.get('/api/courses/:id', (req, res) => {
    const id = parseInt(req.params.id)

    db.one('SELECT * FROM accounts WHERE id = $1', id)
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
    const course = courses.find(c => c.id === parseInt(req.params.id))
    if (!course) res.status(404).send('The courses with the gived id')

    course.name = req.body.name
    res.status(200).send(courses)
})

app.delete('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id))
    if (!course) res.status(404).send('The courses with the gived id')

    const index = courses.indexOf(course)
    courses.splice(index, 1)
    res.status(200).send(courses)
})

const port = process.env.PORT || 5000
app.listen(port, () => console.log(`Listening on port ${ port }....`))