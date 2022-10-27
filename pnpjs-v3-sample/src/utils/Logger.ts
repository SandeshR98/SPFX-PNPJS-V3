const writeError = (serviceTitle?: string, functionName?: string, errorMessage?: string): void => {
	const title = serviceTitle?.toUpperCase();
	const name = functionName?.toUpperCase();
	const message = errorMessage && JSON.stringify(errorMessage);

	const style = {
		label: `font-weight: bold;`,
		pipe: `font-weight: bold;`,
		title: `font-style: italic; color: yellow;`,
		name: `color: #1a73e8;`,
		message: `color: red;`,
	};

	console.log(
		`%cSERVICE: %c${title} %c| %cFUNCTION: %c${name} %c| %cERROR: %c${message}`,
		// SERVICE TITLE
		`${style.label}`,
		`${style.title}`,
		`${style.pipe}`,

		// FUNCTION NAME
		`${style.label}`,
		`${style.name}`,
		`${style.pipe}`,

		// ERROR MESSAGE
		`${style.label}`,
		`${style.message}`
	);
};

const logger = { writeError };
export default logger;
