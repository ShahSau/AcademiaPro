import becrypt from "bcryptjs";

const hashPassword = async (password: string) => {
  const salt = await becrypt.genSalt(10);
  const hash = await becrypt.hash(password, salt);
  return hash;
};

const isPassMatched = async (password: string, hash: string) => {
  return await becrypt.compare(password, hash);
};

export { hashPassword, isPassMatched };
