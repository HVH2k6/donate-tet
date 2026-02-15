const mongoose = require('mongoose');

const donorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    amount: { type: Number, required: true },
    message: { type: String, default: "Chúc mừng năm mới!" },
    orderCode: { type: Number, required: true, unique: true },
    status: { type: String, default: 'PENDING' }, // PENDING, PAID, CANCELLED
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Donor', donorSchema);