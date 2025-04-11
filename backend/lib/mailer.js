import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
    },
});

const notificationForm = (content) => (`
      <div style="background-color: #f9f9f9; padding: 20px;">
    <div
      style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); overflow: hidden;">

      <div
        style=" background: linear-gradient(to left, #7f5af0, #ffffff);; padding: 20px; text-align: center;display: flex; align-items: center;">
        <img
          src="https://res.cloudinary.com/dhaz9s7rj/image/upload/v1744252432/logo2_wrud2a.png"
          alt="Logo" style="height: 48px; object-fit: cover;padding-right:15px" />
      </div>
      <h2 style="margin: 0; color: #333; text-align: center; margin-top: 20px; font-size: 20px;">JobHuntly Notification</h2>

      <div style="padding: 20px;">
        <p style="font-size: 16px; color: #333;">
            ${content}
        </p>
      </div>

    </div>
  </div>`)

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
        html: notificationForm(message),
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
        html: notificationForm(message),
    });
};

export const sendUserBlockedEmail = async (to) => {
    const message = `Your account has been <strong style="color:red;">blocked</strong> due to a violation of our terms of service. If you believe this is a mistake, please contact support.`;

    await transporter.sendMail({
        from: `"Job Portal" <${process.env.EMAIL_USERNAME}>`,
        to,
        subject: "Account Blocked Notification",
        html: notificationForm(message),
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
        html: notificationForm(message),
    });
};
