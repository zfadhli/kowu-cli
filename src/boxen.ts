import _boxen, { type Options } from "boxen";

interface Boxen {
	(text: string, options?: Options): string;
	success: (text: string, options?: Options) => string;
	error: (text: string, options?: Options) => string;
	warning: (text: string, options?: Options) => string;
	info: (text: string, options?: Options) => string;
}

const boxen: Boxen = Object.assign(
	(text: string, options?: Options) => _boxen(text, { padding: 1, ...options }),
	{
		success: (text: string, options?: Options) =>
			_boxen(text, { padding: 1, borderColor: "green", ...options }),
		error: (text: string, options?: Options) =>
			_boxen(text, { padding: 1, borderColor: "red", ...options }),
		warning: (text: string, options?: Options) =>
			_boxen(text, { padding: 1, borderColor: "yellow", ...options }),
		info: (text: string, options?: Options) =>
			_boxen(text, { padding: 1, borderColor: "blue", ...options }),
	},
);

export { boxen };
