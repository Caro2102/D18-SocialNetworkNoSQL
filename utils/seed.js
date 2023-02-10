const connection = require('../config/connection');
const { User, Thought } = require('../models');
const { users, thoughts } = require('./data');

connection.on('error', (err) => err);

connection.once('open', async () => {
  console.log('connected');
  //Borrar toda la informacion para pensamiento
  await Thought.deleteMany({}); 
  //Borrar toda la informacion para usuario
  await User.deleteMany({}); 
  //Crear informacion para usuario
  await User.collection.insertMany(users); 
  //Crear informacion para pensamiento
  await Thought.collection.insertMany(thoughts); 

  console.table(users); 
  console.table(thoughts);
  console.info('Seeding complete!');
  process.exit(0); 
});