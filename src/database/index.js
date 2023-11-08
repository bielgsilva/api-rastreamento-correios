const knex = require('knex')({
    client: 'pg',
    connection: process.env.DB_URI, //COLOCAR DATA BASE
})

module.exports = knex