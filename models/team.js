import mongoose from 'mongoose'

export const Team = mongoose.model('Team', {
  name: String,
  members: Number,
  color: String,
  location: String
})
