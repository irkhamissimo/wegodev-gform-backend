import mongoose from 'mongoose';

const connection = () => {
  mongoose.connect('mongodb://localhost:27017', {
    dbName: 'irkham-form',
  });
  
  const connection = mongoose.connection;
  connection.on('error', console.error.bind(console, 'connection error:'));
  connection.once('open', () => {
    console.log('Connected to MongoDB');
  });
}

export default connection;
