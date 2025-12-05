const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail", // or switch to SES/SendGrid for scaling
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

const sendOrderConfirmationEmail = async (to, orderId, totalAmount) => {
    const mailOptions = {
        from: `"Travel Scrapbook" <${process.env.SMTP_USER}>`,
        to,
        subject: "Order Confirmation - Travel Scrapbook",
        html: `
      <h2>🎉 Thank you for your purchase!</h2>
      <p>Your order <b>#${orderId}</b> has been placed successfully.</p>
      <p>Total: <b>₹${totalAmount}</b></p>
      <p>Our delivery partner will contact you within a few days.</p>
      <br/>
      <p>Keep exploring memories with <b>Travel Scrapbook</b>.</p>
    `,
    };

    await transporter.sendMail(mailOptions);
};

module.exports = { sendOrderConfirmationEmail };
