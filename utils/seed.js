const connection = require('../config/connection');
const { Thoughts, Users } = require('../models');
const { getRandomUser, getRandomThoughts } = require('./data');

connection.on('error', (err) => err);

connection.once('open', async () => {
  console.log('connected');

  // Drop existing courses
  await Thoughts.deleteMany({});

  // Drop existing students
  await Users.deleteMany({});

  // Create empty array to hold the students
  const users = [];
  const thoughts = getRandomThoughts(20);
  // Loop 20 times -- add users to the users array
  for (let i = 0; i < 20; i++) {
    // Get some random assignment objects using a helper function that we imported from ./data

    const fullName = getRandomUser();
    const first = fullName.split(' ')[0];
    const last = fullName.split(' ')[1];

    users.push({
      first,
      last,
    });
  }

  // Add students to the collection and await the results
  await Users.collection.insertMany(users);

  // Add courses to the collection and await the results
  await Thoughts.collection.insertMany({
    thoughtName: thoughts,
    users: [...users],
  });

  // Log out the seed data to indicate what should appear in the database
  console.table(users);
  console.info('Seeding complete! 🌱');
  process.exit(0);
});
