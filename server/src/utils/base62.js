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

export default { encodeBuffer };
