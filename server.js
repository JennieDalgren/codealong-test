import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import { Pokemon } from './models/pokemon.js'
import { Team } from './models/team.js'

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/pokemon'
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

// Setup models here
// const Team = mongoose.model('Team', {
//   name: String,
//   members: Number,
//   color: String,
//   location: String
// })

// const Pokemon = mongoose.model('Pokemon', {
//   name: String,
//   type: String,
//   isCute: Boolean,
//   team: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Team'
//   }
// })

if (process.env.RESET_DB) {
  console.log('Resetting database!')

  const seedDatabase = async () => {
    await Pokemon.deleteMany()
    await Team.deleteMany()

    const flamez = new Team({
      name: 'The Flamez',
      members: 21,
      color: 'orange',
      location: 'Jupiter'
    })
    await flamez.save()

    const magic = new Team({
      name: 'Magic Team',
      members: 10,
      color: 'purple',
      location: 'Venus'
    })
    await magic.save()

    const superTeam = new Team({
      name: 'Super Team',
      members: 33,
      color: 'yellow',
      location: 'The Moon'
    })
    await superTeam.save()

    const pika = new Pokemon({
      name: 'Pikachu',
      type: 'electric',
      isCute: true,
      team: superTeam
    })
    await pika.save()

    const bulba = new Pokemon({
      name: 'Bulbasaur',
      type: 'grass',
      isCute: true,
      team: magic
    })
    await bulba.save()

    await new Pokemon({
      name: 'Charmander',
      type: 'fire',
      isCute: false,
      team: flamez
    }).save()
  }

  seedDatabase()
}

// Defines the port the app will run on. Defaults to 8080, but can be
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello world')
})

app.get('/pokemons', async (req, res) => {
  const pokemons = await Pokemon.find().populate('team')
  res.json(pokemons)
})

app.get('/pokemons/:id/', async (req, res) => {
  const pokemon = await Pokemon.findById(req.params.id)
  if (pokemon) {
    res.json(pokemon)
  } else {
    res.status(404).json({ error: 'pokemon not found' })
  }
})

app.get('/teams/', async (req, res) => {
  const membersAbove = req.query.members

  const teams = membersAbove
    ? await Team.find({ members: { $gte: membersAbove } })
    : await Team.find()

  if (teams.length) {
    console.log(teams)
    res.json(teams)
  } else {
    res.status(404).json({ error: 'No teams found' })
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
