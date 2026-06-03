function normalizeCategory(category) {
	if (!category) {
		return '[APP]';
	}

	return category.startsWith('[') ? category : `[${category}]`;
}

function serializeMeta(meta) {
	if (meta === undefined || meta === null) {
		return '';
	}

	if (typeof meta === 'string') {
		return meta;
	}

	try {
		return JSON.stringify(meta);
	} catch (error) {
		return String(meta);
	}
}

function write(level, category, message, meta) {
	const timestamp = new Date().toISOString();
	const parts = [timestamp, `[${level}]`, normalizeCategory(category), message];
	const metaText = serializeMeta(meta);

	if (metaText) {
		parts.push(metaText);
	}

	const line = parts.join(' | ');

	if (level === 'ERROR') {
		console.error(line);
		return;
	}

	if (level === 'WARN') {
		console.warn(line);
		return;
	}

	console.log(line);
}

const logger = {
	info(category, message, meta) {
		write('INFO', category, message, meta);
	},
	success(category, message, meta) {
		write('SUCCESS', category, message, meta);
	},
	warn(category, message, meta) {
		write('WARN', category, message, meta);
	},
	error(category, message, meta) {
		write('ERROR', category, message, meta);
	}
};

export default logger;