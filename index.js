const express = require('express')
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
    res.send(courses)
})

app.get('/api/courses/:id', (req, res) => {
   let year = req.params.id
   res.send(year)
})

app.post('/api/courses', (req, res) => {
    const course = {
        id: courses.length + 1,
        name: req.body.name
    }   
    courses.push(course)
    res.send(courses)
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