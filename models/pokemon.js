import mongoose from 'mongoose'

export const Pokemon = mongoose.model('Pokemon', {
  name: String,
  type: String,
  isCute: Boolean,
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team'
  }
})
