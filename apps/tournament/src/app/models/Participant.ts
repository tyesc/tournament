import mongoose from "mongoose";

import { ParticipantInterface } from './interfaces';

const Participant = new mongoose.Schema<ParticipantInterface>({

  id: {
    type: String,
    required: true,
  },

  name: {
    type: String,
    required: true,
  },

  elo: {
    type: Number,
    required: true,
  },

});

export default mongoose.model('Participant', Participant);