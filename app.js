const bodyParser = require('body-parser')
const cors = require('cors')
const express = require('express')
const fs = require('fs')
const moment = require('moment')
const port = process.env.PORT || 3000

const app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors())
app.set('view engine', 'pug')
app.locals.moment = require('moment')

app.get('/', async function (req, res) {
  try{
    let data = fs.readFileSync('data/data.json')
    data = JSON.parse(data)
    let { breathing, weight } = data
    breathing = breathing.reverse().slice(0.20)
    weight = weight.reverse().slice(0.20)

    res.render('index', { breathing, weight })
  }catch(err){
    console.error({err})
    res.render('index', {
      breathing: [],
      weight: []
    })
  }
})

app.post('/', async (req, res) => {
  const { body } = req
  const { postBreathing, postWeight } = body
  let data

  try{
    data = fs.readFileSync('data/data.json')
    data = JSON.parse(data)
  }catch(err){
    data = {
      breathing: [],
      weight: []
    }
  }

  try{
    let { breathing, weight } = data
    const timestamp = moment().format()

    if(postBreathing)
      breathing.push({
        timestamp,
        rate: parseFloat(postBreathing)
      })
    
    if(postWeight)
      weight.push({
        timestamp,
        weight: parseFloat(postWeight)
      })

    data = {
      breathing,
      weight
    }

    data = JSON.stringify(data, null, 2)
    fs.writeFileSync('data/data.json', data)
    return res.redirect('/')
  }catch(err){
      console.error({err})
      return res.status(500).send()
  }
})

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
})