// Import Mongoose
const mongoose = require('mongoose');


const TableSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  hobbies:{
    type: String, 
    required:true
  }
});


const table = mongoose.model('tableData', TableSchema);

module.exports = table;
