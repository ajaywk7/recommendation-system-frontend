import MyContext from "./myContext";
import React, { Component } from "react";
import {
  updateCartData,
  getCartData,
  uploadProfileData,
  getProfileData,
} from "../ApiHandlers/publicCalls";
import { getAT, setAT } from "../context/auth";

class MyProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      wishlist: [],
      cart: [],
      cartItems: [],
      isAuth: false,
      cartTotal: 0,
      googleId: "",
      profile: {},
    };
    this.addToCart = this.addToCart.bind(this);
    this.addToWishlist = this.addToWishlist.bind(this);
    this.removeFromCart = this.removeFromCart.bind(this);
    this.emptyCart = this.emptyCart.bind(this);
    this.update = this.update.bind(this);
    this.calcTotal = this.calcTotal.bind(this);
    this.setId = this.setId.bind(this);
    this.getId = this.getId.bind(this);
    this.logout = this.logout.bind(this);
  }

  async componentDidMount() {
    let googleId = await getAT();
    await this.setState({
      googleId: googleId,
    });
    await this.update();

    console.log(" id " + googleId);
  }

  async setId(profileObj) {
    await setAT(profileObj["googleId"]);
    this.setState({
      googleId: profileObj["googleId"],
    });
    await uploadProfileData(profileObj);
    await updateCartData(
      this.state.cart,
      this.state.cartItems,
      this.state.wishlist,
      this.state.cartTotal
    );

    await this.update();
    console.log("logged in as " + this.state.googleId);
  }

  async getId() {}

  async logout() {
    console.log("logged out");
    await setAT("");
    this.setState({
      googleId: "",
    });
    await await updateCartData(
      this.state.cart,
      this.state.cartItems,
      this.state.wishlist,
      this.state.cartTotal
    );
    await this.update();

    console.log("logged in as " + (await getAT()));
  }

  async update() {
    let result = await getCartData();
    this.setState({
      cart: result["cart"] ?? [],
      cartItems: result["cartItems"] ?? [],
      wishlist: result["wishlist"] ?? [],
      cartTotal: result["cartTotal"] ?? 0,
    });
    if (this.state.googleId !== "") {
      let profile = await getProfileData(this.state.googleId);
      console.log(profile);
      this.setState({
        profile: profile,
      });
    }
  }

  async calcTotal() {
    //chumma
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
    await updateCartData(
      cart,
      cartItems,
      this.state.wishlist,
      this.state.cartTotal
    );

    await this.update();
    //console.log(cartItems);
  }

  async removeFromCart(item) {
    var cart = this.state.cart;
    var cartItems = this.state.cartItems;
    if (cart.includes(item.name)) {
      let index = cart.indexOf(item.name);
      cartItems[index]["qty"] -= 1;
      if (cartItems[index].qty === 0) {
        //console.log("varthu");
        cart.splice(index, 1);
        cartItems.splice(index, 1);
      }
    }
    await this.setState({
      cart: cart,
      cartItems: cartItems,
    });
    await updateCartData(
      cart,
      cartItems,
      this.state.wishlist,
      this.state.cartTotal
    );

    await this.update();

    //console.log(cartItems);
  }

  async emptyCart() {
    await updateCartData([], [], this.state.wishlist, 0);
    await this.update();
  }

  async addToWishlist(itemName, add) {
    let wishlist = this.state.wishlist;
    if (add) {
      wishlist.push(itemName);
    } else {
      wishlist.splice(wishlist.indexOf(itemName), 1);
    }
    this.setState({
      wishlist: wishlist,
    });
    await updateCartData(
      this.state.cart,
      this.state.cartItems,
      wishlist,
      this.state.cartTotal
    );
    await this.update();
  }

  render() {
    return (
      <MyContext.Provider
        value={{
          cart: this.state.cart,
          wishlist: this.state.wishlist,
          cartItems: this.state.cartItems,
          cartTotal: this.state.cartTotal,
          addToCart: this.addToCart,
          addToWishlist: this.addToWishlist,
          removeFromCart: this.removeFromCart,
          emptyCart: this.emptyCart,
          update: this.update,
          setId: this.setId,
          googleId: this.state.googleId,
          profile: this.state.profile,
          logout: this.logout,
        }}
      >
        {this.props.children}
      </MyContext.Provider>
    );
  }
}

export default MyProvider;
