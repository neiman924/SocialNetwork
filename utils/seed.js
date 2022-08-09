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
  const thoughts = [];
  // Loop 20 times -- add users to the users array
  for (let i = 0; i < 20; i++) {
    // Get some random assignment objects using a helper function that we imported from ./data
    const thought = getRandomThoughts(); 
    //const comments = getRandomComments(20);

    const fullName = getRandomUser();
    const first = fullName.split(' ')[0];
    const last = fullName.split(' ')[1];
    const email = 'test1@test.com';
    users.push({
      first,
      last,
      email,
    });
    thoughts.push({
      thought,
      fullName,
    });
  }

  console.log(users,thoughts);
  // Add students to the collection and await the results
  await Users.collection.insertMany(users);

  // Add Thoughts to the collection and await the results
  await Thoughts.collection.insertMany(thoughts,users);

  // Log out the seed data to indicate what should appear in the database
  console.table(users);
  console.table(thoughts);

  console.info('Seeding complete! 🌱');
  process.exit(0);
});
