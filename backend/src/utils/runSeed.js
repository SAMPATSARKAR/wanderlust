const mongoose = require('mongoose');
const { seedDatabase } = require('./seedData');

const run = async () => {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
  console.log('Connected to local MongoDB on port 27017');
  await seedDatabase();
  console.log('Seeding complete!');
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
