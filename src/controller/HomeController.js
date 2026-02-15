const { PayOS } = require('@payos/node');
const Donor = require('../models/Donor');
require('dotenv').config();

const payos = new PayOS({
    clientId: process.env.PAYOS_CLIENT_ID,
    apiKey: process.env.PAYOS_API_KEY,
    checksumKey: process.env.PAYOS_CHECKSUM_KEY,
});

const index = async (req, res) => {
    try {
        // Lấy top 20 người donate thành công, xếp theo tiền giảm dần
        const topDonors = await Donor.find({ status: 'PAID' })
            .sort({ amount: -1, createdAt: -1 })
            .limit(20);
        res.render('index', { topDonors });
    } catch (error) {
        console.error(error);
        res.render('index', { topDonors: [] });
    }
};

const createQr = async (req, res) => {
    try {
        const { name, amount, message } = req.body;
        console.log("🚀 ~ createQr ~ message:", message)
        console.log("🚀 ~ createQr ~ amount:", amount)
        console.log("🚀 ~ createQr ~ name:", name)
        const amountNum = Number(amount);

        if (!amountNum || amountNum < 2000) {
            return res.json({ error: -1, message: "Số tiền tối thiểu 2.000đ" });
        }

        // Tạo mã đơn hàng ngẫu nhiên
        const orderCode = Number(String(Date.now()).slice(-6) + Math.floor(Math.random() * 100));
        const domain = process.env.DOMAIN || 'http://localhost:3000';



        const body = {
            orderCode: orderCode,
            amount: amountNum,
            description: 'Lì xì Tết 2026',
            items: [{ name: "Lì xì Tết", quantity: 1, price: amountNum }],
            returnUrl: `${domain}`,
            cancelUrl: `${domain}`,
        };

        const paymentLinkResponse =  await payos.paymentRequests.create(body);
        // Lưu DB trạng thái PENDING
        await Donor.create({
            name: name,
            amount: amountNum,
            message: message || "Chúc mừng năm mới!",
            orderCode: orderCode,
            status: 'PENDING'
        });

        res.json({
            error: 0,
            message: "Success",
            data: paymentLinkResponse
        });

    } catch (error) {
        console.error(error);
        res.json({ error: -1, message: "Lỗi tạo link thanh toán" });
    }
};

const checkStatus = async (req, res) => {
    try {
        const { orderCode } = req.query;
        if (!orderCode) return res.json({ status: "PENDING" });

        const paymentInfo = await payos.paymentRequests.get(String(orderCode));

        if (paymentInfo && paymentInfo.status === "PAID") {
            await Donor.findOneAndUpdate({ orderCode }, { status: 'PAID' });
            return res.json({ status: "PAID" });
        } 
        return res.json({ status: "PENDING" });
    } catch (error) {
        return res.json({ status: "PENDING" });
    }
};

module.exports = { index, createQr, checkStatus };