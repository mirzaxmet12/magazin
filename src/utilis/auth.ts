const TOKEN_KEY = "token";
const REFRESH_KEY = "refresh_token";

export const getToken = (): string | null =>{ 
   return localStorage.getItem(TOKEN_KEY);
}
export const setToken = (access: string,refresh:string) => {
    localStorage.setItem(TOKEN_KEY, access);
    localStorage.setItem(REFRESH_KEY,refresh);
}

export const clearToken = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
}