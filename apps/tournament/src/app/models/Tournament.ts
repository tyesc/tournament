import mongoose from "mongoose";

import { TournamentInterface } from './interfaces';

const Tournament = new mongoose.Schema<TournamentInterface>({

  id: {
    type: String,
    required: true,
  },

  name: {
    type: String,
    required: true,
  },

  phases: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Phase',
    required: true,
  }],

  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Participant',
    required: true,
  }],

});

export default mongoose.model('Tournament', Tournament);