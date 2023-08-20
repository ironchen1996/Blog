import { PASSWORD_KEY, REMEMBER_KEY, USERNAME_KEY } from "../Constants/UserKey";

export function rememberUser(username: string, password: string) {
  localStorage.setItem(USERNAME_KEY, username);
  localStorage.setItem(PASSWORD_KEY, password);
}

export function deleteUserFormStorage() {
  localStorage.removeItem(USERNAME_KEY);
  localStorage.removeItem(PASSWORD_KEY);
}

export function getUserInfoFormStorage() {
  return {
    username: localStorage.getItem(USERNAME_KEY),
    password: localStorage.getItem(PASSWORD_KEY),
    remember: localStorage.getItem(REMEMBER_KEY) === "true",
  };
}
