import mongoose from 'mongoose'

export const userModel = mongoose.model('user', new mongoose.Schema({
  userId: { type: String, index: { unique: true } },
  name: String,
  update_at: Date,
  create_at: {
    type: Date,
    default: Date.now(),
  },
}));