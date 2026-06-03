import { loginService, signupService } from './auth.service.js';

function validateEmail(email) {
	const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return re.test(String(email).toLowerCase());
}

export async function signup(req, res, next) {
	try {
		const { email, password } = req.body || {};

		if (!email || !password) {
			return res.status(400).json({ success: false, message: 'Missing email or password' });
		}

		if (!validateEmail(email)) {
			return res.status(400).json({ success: false, message: 'Invalid email format' });
		}

		const result = await signupService({ email, password });

		return res.status(201).json({ success: true, message: 'Signup successful', data: { token: result.token } });
	} catch (err) {
		if (err && err.statusCode) {
			return res.status(err.statusCode).json({ success: false, message: err.message });
		}
		return next(err);
	}
}

export async function login(req, res, next) {
	try {
		const { email, password } = req.body || {};

		if (!email || !password) {
			return res.status(400).json({ success: false, message: 'Missing email or password' });
		}

		if (!validateEmail(email)) {
			return res.status(400).json({ success: false, message: 'Invalid email format' });
		}

		const result = await loginService({ email, password });

		return res.status(200).json({
			success: true,
			message: 'Login successful',
			data: {
				token: result.token,
				user: result.user
			}
		});
	} catch (err) {
		if (err && err.statusCode) {
			return res.status(err.statusCode).json({ success: false, message: err.message });
		}
		return next(err);
	}
}