import { get, post } from "./global";
import { server } from "../config/urls";
import { DeviceUUID } from "device-uuid";
import { getAT } from "../context/auth";

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

async function search(search) {
  let options = {
    search: search,
  };
  let results = await post(server + "search", options);
  return results;
}

async function wishlist(names) {
  let options = {
    names: names,
  };
  let results = await post(server + "productsWName", options);
  return results;
}

async function getCartData() {
  let options = {
    uid: new DeviceUUID().get(),
  };
  let googleId = await getAT();
  if (googleId !== "") {
    options.googleId = googleId;
  }
  let results = await post(server + "getUData", options);
  return results;
}

async function updateCartData(cart, cartItems, wishlist, cartTotal) {
  let options = {
    cart: cart,
    cartItems: cartItems,
    wishlist: wishlist,
    uid: new DeviceUUID().get(),
    cartTotal: cartTotal,
  };
  let googleId = await getAT();
  if (googleId !== "") {
    options.googleId = googleId;
  }
  let results = await post(server + "updateUData", options);
  return results;
}

async function uploadProfileData(profileObj) {
  await post(server + "uploadProf", profileObj);
}

async function newOrder(order) {
  await post(server + "newOrder", order);
}

async function paymentInitiate(amount) {
  return await post(server + "pay", { amount: amount });
}

async function getOrders(googleId) {
  return await post(server + "getOrders", { googleId: googleId });
}

async function getProfileData(id) {
  let options = {
    googleId: id,
  };
  let result = await post(server + "getProf", options);
  return result;
}
async function recommendProducts(name) {
  let options = {
    name: name,
  };
  let result = await post(server + "getRecommendations", options);
  return result;
}

export {
  getCategories,
  getProdWCat,
  updateCartData,
  getCartData,
  uploadProfileData,
  getProfileData,
  newOrder,
  paymentInitiate,
  getOrders,
  search,
  wishlist,
  recommendProducts,
};
