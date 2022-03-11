import mongoose from 'mongoose';

import { MatchInterface } from './interfaces';

const Match = new mongoose.Schema<MatchInterface>({

  participant1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Participant',
    required: true,
  },

  participant2: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Participant',
    required: true,
  },

});

export default mongoose.model('Match', Match);