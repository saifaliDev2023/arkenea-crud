const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const crudSchema = new Schema({
    first_name: { type: String, require: true },
    last_name: { type: String, require: true },
    email: { type: String, unique: true, require: true },
    phone_number: { type: Number, unique: true, require: true },
    profile_image: { type: String},
}, { timestamps: true });

module.exports = mongoose.model('Crud', crudSchema, 'crudRecords')