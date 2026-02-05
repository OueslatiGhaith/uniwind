export const stringifyThemes = (themes = []) => `[${themes.map((theme) => `'${theme}'`).join(", ")}]`;
