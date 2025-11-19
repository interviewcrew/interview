"use server";

export const validateInviteCode = async (code: string) => {
  const validCode = process.env.INVITE_CODE;
  
  if (!validCode) {
    return false;
  }
  
  return code === validCode;
};

