import { getCookie, setCookie } from "vinxi/http";
import { THEME_COOKIE_NAME } from "../const";
import { themeModeSchema, ThemeMode } from "../schemas";


export const setThemeCookie = (val: ThemeMode) => {
    setCookie(THEME_COOKIE_NAME, val, {
        httpOnly: false,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        // 10 years
        maxAge: 60 * 60 * 24 * 365 * 10,
    });
};

export const getThemeCookie = (): ThemeMode => {
    const cookie = getCookie(THEME_COOKIE_NAME);
    return themeModeSchema.catch("system").parse(cookie ?? "system");
};
