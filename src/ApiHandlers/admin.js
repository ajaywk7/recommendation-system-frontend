import { get, post } from "./global";
import { server } from "../config/urls";

async function getOrders() {
  let results = await get(server + "getOrders");
  return results;
}

async function updateOrder(order) {
  await post(server + "updateOrder", order);
}

async function getProducts() {
  let results = await get(server + "getProducts");
  return results;
}

async function deleteProduct(product) {
  await post(server + "deleteProduct", product);
}

async function updateProduct(product) {
  await post(server + "updateProduct", product);
}

export { getOrders, updateOrder, getProducts, updateProduct, deleteProduct };
