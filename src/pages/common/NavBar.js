import React, { Component } from "react";

import {
  Nav,
  Navbar,
  NavDropdown,
  Form,
  FormControl,
  Button,
  Image,
} from "react-bootstrap";
import { BiCartAlt } from "react-icons/bi";

import { withRouter } from "react-router-dom";
import { getCategories } from "../../ApiHandlers/publicCalls";
import * as color from "../../config/color";
import MyContext from "../../context/myContext";
import "../styles.css";

class NavBar extends Component {
  static contextType = MyContext;
  constructor(props) {
    super(props);
    this.state = {
      cats: [],
      search: "",
    };
  }

  async componentDidMount() {
    let cats = await getCategories();
    this.setState({
      cats: cats,
    });
  }

  render() {
    return (
      <Navbar bg="dark" variant="dark" expand="lg">
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Brand className="mx-auto" href="/">
          BS-Mart
        </Navbar.Brand>

        <Navbar.Collapse id="basic-navbar-nav ">
          <Nav className="ml-auto">
            <Nav.Link
              onClick={(e) => {
                e.target.blur();
                this.props.history.push({
                  pathname: "/wishlist",
                  state: {
                    wishlist: this.context.wishlist,
                  },
                });
              }}
            >
              Wishlist
            </Nav.Link>
            <Nav.Link href="/category/all">View all</Nav.Link>
            <NavDropdown title="Shop by" id="basic-nav-dropdown">
              {this.state.cats.map((value, index) => (
                <NavDropdown.Item key={index} href={"/category/" + value.name}>
                  {value.name}
                </NavDropdown.Item>
              ))}
            </NavDropdown>
            {this.context.profile !== undefined &&
            this.context.googleId !== "" ? (
              <NavDropdown
                className="mr-auto"
                title={
                  <Image
                    src={this.context.profile.imageUrl}
                    style={{
                      width: 30,
                    }}
                    roundedCircle
                  />
                }
                id="basic-nav-dropdown"
              >
                <NavDropdown.Item disabled>
                  Logged in as {this.context.profile.givenName}
                </NavDropdown.Item>
                <NavDropdown.Item href="/my_orders">My orders</NavDropdown.Item>
                <NavDropdown.Item onClick={() => this.context.logout()}>
                  logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <Nav.Link href="/login">Login</Nav.Link>
            )}
          </Nav>
          <Nav
            style={{
              marginLeft: 20,
            }}
          >
            <Form inline>
              <FormControl
                type="text"
                placeholder="Search"
                style={{ width: 250 }}
                value={this.state.search}
                onChange={(v) =>
                  this.setState({
                    search: v.target.value,
                  })
                }

                //className="mr-sm-2"
              />
              <Button
                style={{ marginLeft: 5 }}
                variant="outline-success"
                onClick={(e) => {
                  e.target.blur();

                  this.props.history.replace({
                    pathname: "/search",
                    state: {
                      search: this.state.search,
                    },
                  });
                  this.setState({
                    search: "",
                  });
                }}
              >
                Search
              </Button>
            </Form>
          </Nav>
        </Navbar.Collapse>

        <div className="cartContainer">
          <BiCartAlt
            className="cartIcon"
            size={30}
            color={color.white}
            onClick={() => {
              this.props.history.push("/cart");
            }}
          />
          {this.context.cartItems.length > 0 && (
            <div className="cartQty"> {this.context.cart.length}</div>
          )}
        </div>
      </Navbar>
    );
  }
}

export default withRouter(NavBar);
