const mongoose = require('mongoose');
require('dotenv').config();
module.exports.connect = async () => {
  try {
    await mongoose.connect(process.env.MONGOO_DB);
    console.log('>>>>connect success');
  } catch (error) {
    console.log(error);
  }
};

/**
 * 
 * const Product = mongoose.model("Product", {
    name: String
    
})
 */
