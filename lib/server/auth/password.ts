const bcrypt = require("bcryptjs") as {
  hash: (value: string, rounds: number) => Promise<string>;
  compare: (value: string, hash: string) => Promise<boolean>;
};

const SALT_ROUNDS = 10;

export async function hashPassword(password: string) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, passwordHash: string) {
  return bcrypt.compare(password, passwordHash);
}
