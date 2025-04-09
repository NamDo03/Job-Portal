import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
    },
});

export const sendVerificationEmail = async (to, code) => {
    await transporter.sendMail({
        from: `"Verify App" <jobhuntly@test.com>`,
        to: to,
        subject: "Email Verification Code",
        html: `<p>Your verification code is: <strong>${code}</strong></p>`,
    });
};
