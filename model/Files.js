const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  name: String,
  mime: String,
  filename: String,
  fileId: String,
  url: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  size: Number,
});

const Files = mongoose.model('Files', fileSchema);
module.exports = Files;
