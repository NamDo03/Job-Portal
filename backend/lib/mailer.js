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

export const sendCompanyStatusEmail = async (to, status) => {
    let subject = "Company Status Update";
    let message = "";

    if (status === "APPROVED") {
        message = "Your company has been <strong style='color:green;'>approved</strong>. You can now post jobs and access full features.";
    } else if (status === "BLOCKED") {
        message = "Your company account has been <strong style='color:red;'>blocked</strong> due to policy violations.";
    } else if (status === "REJECTED") {
        message = "Your company registration has been <strong style='color:red;'>rejected</strong>. Please review your information and try again.";
    }

    await transporter.sendMail({
        from: `"Job Portal" <${process.env.EMAIL_USERNAME}>`,
        to,
        subject,
        html: `<p>${message}</p>`,
    });
};


export const sendJobPostStatusEmail = async (to, jobTitle, status) => {
    const subject = `Your Job Post "${jobTitle}" has been ${status}`;
    const message =
        status === "APPROVED"
            ? `Your job post "<strong>${jobTitle}</strong>" has been <strong style="color:green;">approved</strong> and is now visible to candidates.`
            : `Your job post "<strong>${jobTitle}</strong>" has been <strong style="color:red;">rejected</strong>. Please review our policies and edit your listing.`;


    await transporter.sendMail({
        from: `"Job Portal" <${process.env.EMAIL_USERNAME}>`,
        to,
        subject,
        html: `<p>${message}</p>`,
    });
};

export const sendUserBlockedEmail = async (to) => {
    await transporter.sendMail({
        from: `"Job Portal" <${process.env.EMAIL_USERNAME}>`,
        to,
        subject: "Account Blocked Notification",
        html: `Your account has been <strong style="color:red;">blocked</strong> due to a violation of our terms of service. If you believe this is a mistake, please contact support.`,
    });
};

export const sendApplicationStatusEmail = async (to, jobTitle, status) => {
    const subject = `Your Application for "${jobTitle}" has been ${status}`;
    const message =
        status === "ACCEPTED"
            ? `Congratulations! Your application for "<strong>${jobTitle}</strong>" has been <strong style="color:green;">accepted</strong>.`
            : `We regret to inform you that your application for "<strong>${jobTitle}</strong>" has been <strong style="color:red;">rejected</strong>.`;

    await transporter.sendMail({
        from: `"Job Portal" <${process.env.EMAIL_USERNAME}>`,
        to,
        subject,
        html: `<p>${message}</p>`,
    });
};
