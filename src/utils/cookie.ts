import { getCurrentDate } from "./dates";

export const setCookie = (name: string, value: string, days: number = 1) => {
  console.log(name, value, days);
  const date = getCurrentDate();
  date.setTime(date.getTime() + days * 60 * 60 * 1000); //1 jour
  const expires = "expires=" + date.toUTCString();
  document.cookie = `${name}=${value}; ${expires};path=/`;
};

export const getCookie = (name: string) => {
  const nameEq = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    const c = ca[i].trim();
    if (c.indexOf(nameEq) == 0) {
      return c.substring(nameEq.length, c.length);
    }
  }
  return "";
};

export const deleteCookie = (name: string) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
};
