import bcrypt from 'bcrypt';

const DEFAULT_SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS, 10) || 10;

export async function hashPassword(plain) {
  const salt = await bcrypt.genSalt(DEFAULT_SALT_ROUNDS);
  return bcrypt.hash(plain, salt);
}

export async function comparePassword(plain, hash) {
  return bcrypt.compare(plain, hash);
}

export default { hashPassword, comparePassword };
// ESM module: removed CommonJS export to avoid runtime errors under "type": "module".
