import crypto from 'crypto';

const ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

function encodeBigIntToBase62(num) {
	if (num === 0n) return '0';
	let s = '';
	while (num > 0n) {
		const rem = Number(num % 62n);
		s = ALPHABET[rem] + s;
		num = num / 62n;
	}
	return s;
}

export function encodeBuffer(buf) {
	// Interpret buffer as unsigned big-endian integer
	let n = 0n;
	for (const byte of buf) {
		n = (n << 8n) + BigInt(byte);
	}
	return encodeBigIntToBase62(n);
}

export function generateRandomBase62(length = 8) {
	const bytes = crypto.randomBytes(Math.ceil((length * Math.log2(62)) / 8));
	const encoded = encodeBuffer(bytes);
	// Ensure the returned string has at least `length` characters
	if (encoded.length >= length) return encoded.slice(0, length);
	// pad by generating more if necessary
	while (encoded.length < length) {
		const extra = encodeBuffer(crypto.randomBytes(2));
		encoded += extra;
	}
	return encoded.slice(0, length);
}

export default { encodeBuffer, generateRandomBase62 };
