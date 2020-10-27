export const SERVICE_PORT = process.env.SERVICE_PORT || 3333;

export const API_URI = process.env.API_URI || "http://localhost";
export const API_PORT = process.env.API_PORT || 5555;
export const API_SECRET = process.env.API_SECRET || "bubblegum_cat";
export const API_URL = API_URI === "http://localhost" ? `${API_URI}:${API_PORT}` : API_URI;

export const PROVIDER_URI = process.env.PROVIDER_URI || "https://api.unsplash.com";
export const PROVIDER_CLIENT_ID = process.env.PROVIDER_CLIENT_ID || "lollipop_tiger";
