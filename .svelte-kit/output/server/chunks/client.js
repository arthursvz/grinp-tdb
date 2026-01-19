import { w as writable } from "./index2.js";
import { g as get_store_value } from "./lifecycle.js";
import "./stores.js";
const defaultOptions = {
  clearArray: false,
  clearOnNavigate: true,
  clearAfterMs: 0,
  flashCookieOptions: {
    path: "/",
    maxAge: 120,
    httpOnly: false,
    sameSite: "strict"
  }
};
class FlashMessage {
  options;
  _message;
  get message() {
    return this._message;
  }
  _flashTimeout = 0;
  get flashTimeout() {
    return this._flashTimeout;
  }
  constructor(message, options) {
    this.options = options ?? defaultOptions;
    this._message = {
      subscribe: message.subscribe,
      set: (value, options2) => message.update(($message) => this.update($message, value, options2?.concatenateArray ?? false)),
      update: (updater, options2) => message.update(($message) => this.update($message, updater($message), options2?.concatenateArray ?? false))
    };
  }
  update(current, newData, concatenateArray = false) {
    if (this._flashTimeout)
      clearTimeout(this.flashTimeout);
    if (concatenateArray && Array.isArray(newData)) {
      if (Array.isArray(current)) {
        if (current.length > 0 && newData.length > 0 && current[current.length - 1] === newData[newData.length - 1]) {
          return current;
        } else {
          return current.concat(newData);
        }
      }
    }
    return newData;
  }
}
function _initFlash(page, options) {
  {
    return new FlashMessage(writable(get_store_value(page).data.flash));
  }
}
function getFlash(page, options) {
  return _initFlash(page).message;
}
export {
  getFlash as g
};
