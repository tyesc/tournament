import dotenv from 'dotenv';

/* istanbul ignore next: not needed inside tests */
if (!process.env.TEST) {
  dotenv.config();
}
