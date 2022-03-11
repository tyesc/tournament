import mongoose from "mongoose";

import { PhaseInterface } from './interfaces';

const Phase = new mongoose.Schema<PhaseInterface>({

  type: {
    type: String,
    required: true,
  },

});

export default mongoose.model('Phase', Phase);