const verificationCodes = {};

export const saveVerificationCode = (email, code) => {
    verificationCodes[email] = { code, expiresAt: Date.now() + 5 * 60 * 1000 };
};

export const getVerificationCode = (email) => {
    return verificationCodes[email];
};

export const deleteVerificationCode = (email) => {
    delete verificationCodes[email];
};
