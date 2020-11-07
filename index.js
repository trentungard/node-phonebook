const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
app.use(express.json());
app.use(cors());
app.use(express.static('build'));

morgan.token('logBody', (req, res) => {
    const body = req.body;
    return JSON.stringify(body);
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :logBody'))


let contacts = [
    {
        id: 1,
        number: "5705705700",
        name: "Trent"
    },
    {
        id: 2,
        number: "8721371",
        name: "boogie"
    },
    {
        id: 3,
        number: "87123731",
        name: "ashd"
    }
]

app.get('/', (req, res) => {
    res.send('<h1>Helllo world!</h1>');
    res.end();
})

app.get('/api/contacts', (req, res) => {
    res.json(contacts);
    res.end()
})

app.get('/info', (req, res) => {
    const date = new Date()
    res.send(`
        <p>Phonebook has an entry for ${contacts.length} people<p>
        <br>
        <p>${date}</p>
    `);
    res.end()
})

app.get('/api/contacts/:id', (req, res) => {
    const id = Number(req.params.id);
    const contact = contacts.find( contact => contact.id === id );
    if(contact){
        res.json(contact)
        res.end()
    } else {
        res.status(404)
        res.send('404')
        res.end()
    }
});

app.delete('/api/contacts/:id', (req, res) => {
    console.log(req.params.id);
    console.log(contacts);
    let newArray = contacts.filter(contact => contact.id !== Number(req.params.id));
    contacts = newArray;
    res.send(contacts);
    res.end()
})

app.post('/api/contacts', (req, res) => {
    let contact = req.body;
    const results = contacts.map( cont => cont.name === contact.name || cont.number === contact.number);
    const resultsContainsTrue = results.includes(true);
    console.log(resultsContainsTrue);
    if(contact.name && contact.number && !resultsContainsTrue){
        let lastNumber = contacts.length - 1;
        let lastContactId = contacts[lastNumber].id;
        const id = lastContactId + 1;
        contact.id = id;
        contacts.push(contact);
        console.log(contacts)
        res.status(200);
        res.json(contacts);
        res.end()
    } else if(contact.name && contact.number && resultsContainsTrue){
        res.status(400);
        res.json({error: "this name or number already exists"})
        res.end()
    } else {
        res.status(400);
        res.json({error: "please provide name and number"});
        res.end()
    }
})

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Server running on ${port}`)
})
