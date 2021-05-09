import { get, post } from "./global";
import { server } from "../config/urls";
import { DeviceUUID } from "device-uuid";

async function getCategories() {
  let results = await get(server + "getCat");
  return results;
}

async function getProdWCat(category) {
  let options = {
    category: category,
  };
  let results = await post(server + "productsWCat", options);
  return results;
}

async function getCartData() {
  let options = {
    uid: new DeviceUUID().get(),
  };
  let results = await post(server + "getUData", options);
  return results;
}

async function updateCartData(cart, cartItems, wishlist) {
  let options = {
    cart: cart,
    cartItems: cartItems,
    wishlist: wishlist,
    uid: new DeviceUUID().get(),
  };
  let results = await post(server + "updateUData", options);
  return results;
}

export { getCategories, getProdWCat, updateCartData, getCartData };
