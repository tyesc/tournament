/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import './config';

import { app } from './app';
import  { MongoDB } from './connectors';

const port = process.env.port || 3333;

MongoDB(app);

const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
server.close(() => {
  MongoDB.disconnect();
});
