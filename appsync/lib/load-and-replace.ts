import {readFileSync} from 'fs';
type Replacements = {
    [key: string]: string
}
export function loadAndReplace(filePath: string, replacements: Replacements): string  {
	const data = readFileSync(filePath, 'utf8');
	return data.replace(/(?:{{)([^}]+)(?:}})/g, (_, v) => replacements[v]);
}
