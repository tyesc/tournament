import mongoose from 'mongoose';

import { environment } from '../environments/environment';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare let global: any;

const MongoDB = async app => {
  mongoose.Promise = global.Promise;
  await mongoose.connect(environment.TEST ?  global.__MONGO_URI__ : environment.MONGODB_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  });

  /* istanbul ignore next: cannot test disconnect in dev/test mode */
  process.on('SIGTERM', () => mongoose.disconnect());

  app.set('MongoDB', mongoose);
};

MongoDB.disconnect = async () => {
  await mongoose.disconnect();
};

export default MongoDB;