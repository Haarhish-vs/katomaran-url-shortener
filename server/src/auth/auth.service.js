import prisma from '../config/db.js';
import bcrypt from 'bcrypt';
import { signToken } from '../utils/jwt.js';

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS, 10) || 10;

export async function signupService({ email, password }) {
	// Check for existing user
	const existing = await prisma.user.findUnique({ where: { email } });
	if (existing) {
		const err = new Error('Email already registered');
		err.statusCode = 409;
		throw err;
	}

	// Generate salt and hash password
	const salt = await bcrypt.genSalt(SALT_ROUNDS);
	const hashed = await bcrypt.hash(password, salt);

	// Create user in DB (store hashed password in `passwordHash` per Prisma schema)
	const user = await prisma.user.create({ data: { email, passwordHash: hashed } });

	// Generate JWT
	const token = signToken({ id: user.id, email: user.email });

	return { user: { id: user.id, email: user.email }, token };
}

export async function loginService({ email, password }) {
	const user = await prisma.user.findUnique({
		where: { email },
		select: {
			id: true,
			email: true,
			passwordHash: true
		}
	});

	if (!user) {
		const err = new Error('User not found');
		err.statusCode = 404;
		throw err;
	}

	const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
	if (!isPasswordValid) {
		const err = new Error('Invalid password');
		err.statusCode = 401;
		throw err;
	}

	const token = signToken({ id: user.id, email: user.email });

	return { user: { id: user.id, email: user.email }, token };
}