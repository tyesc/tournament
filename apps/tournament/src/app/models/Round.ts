import mongoose from "mongoose";

import { RoundInterface } from './interfaces';

const Round = new mongoose.Schema<RoundInterface>({

  name: {
    type: String,
    required: true,
  },

  matches: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Match',
    required: true,
  }],

});

export default mongoose.model('Round', Round);