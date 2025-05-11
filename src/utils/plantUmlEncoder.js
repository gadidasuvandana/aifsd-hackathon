import pako from 'pako'; // Ensure you install this library: npm install pako

export const encodePlantUML = (text) => {
  const deflated = pako.deflate(text, { level: 9 });
  return btoa(String.fromCharCode(...new Uint8Array(deflated)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};
