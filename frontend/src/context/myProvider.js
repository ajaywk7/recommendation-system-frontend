import MyContext from "./myContext";
import React, { Component } from "react";
import { updateCartData, getCartData } from "../ApiHandlers/publicCalls";

class MyProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      wishlist: [],
      cart: [],
      cartItems: [],
      isAuth: false,
    };
    this.addToCart = this.addToCart.bind(this);
    this.addToWishlist = this.addToWishlist.bind(this);
    this.removeFromCart = this.removeFromCart.bind(this);
    this.update = this.update.bind(this);
  }

  async componentDidMount() {
    await this.update();
  }

  async update() {
    let result = await getCartData();
    this.setState({
      cart: result["cart"],
      cartItems: result["cartItems"],
      wishlist: result["wishlist"],
    });
  }

  async addToCart(item) {
    var cart = this.state.cart;
    var cartItems = this.state.cartItems;
    if (!cart.includes(item.name)) {
      cart.push(item.name);
      item["qty"] = 1;
      cartItems.push(item);
    } else {
      cartItems[cart.indexOf(item.name)].qty += 1;
    }
    await this.setState({
      cart: cart,
      cartItems: cartItems,
    });
    await updateCartData(cart, cartItems, this.state.wishlist);
    await this.update();
    //console.log(cartItems);
  }

  async removeFromCart(item) {
    var cart = this.state.cart;
    var cartItems = this.state.cartItems;
    if (cart.includes(item.name)) {
      let index = cart.indexOf(item.name);
      if (item.qty === 1) {
        delete cart[index];
        delete cartItems[index];
      } else {
        cartItems[index]["qty"] -= 1;
      }
    }
    await this.setState({
      cart: cart,
      cartItems: cartItems,
    });
    await updateCartData(cart, cartItems, this.state.wishlist);
    await this.update();

    //console.log(cartItems);
  }

  async addToWishlist(itemName, add) {
    let wishlist = this.state.wishlist;
    if (add) {
      wishlist.push(itemName);
    } else {
      delete wishlist[wishlist.indexOf(itemName)];
    }
    this.setState({
      wishlist: wishlist,
    });
    await updateCartData(this.state.cart, this.state.cartItems, wishlist);
    await this.update();
  }

  render() {
    return (
      <MyContext.Provider
        value={{
          cart: this.state.cart,
          wishlist: this.state.wishlist,
          cartItems: this.state.cartItems,
          addToCart: this.addToCart,
          addToWishlist: this.addToWishlist,
          removeFromCart: this.removeFromCart,
          update: this.update,
        }}
      >
        {this.props.children}
      </MyContext.Provider>
    );
  }
}

export default MyProvider;
