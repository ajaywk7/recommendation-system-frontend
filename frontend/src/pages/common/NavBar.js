import React, { Component } from "react";

import {
  Nav,
  Navbar,
  NavDropdown,
  Form,
  FormControl,
  Button,
} from "react-bootstrap";
import { BiCartAlt } from "react-icons/bi";

import { withRouter } from "react-router-dom";
import { getCategories } from "../../ApiHandlers/publicCalls";
import * as color from "../../config/color";

class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cats: [],
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
            <Nav.Link href="/category/all">View all</Nav.Link>
            <NavDropdown title="Shop by" id="basic-nav-dropdown">
              {this.state.cats.map((value, index) => (
                <NavDropdown.Item key={index} href={"/category/" + value.name}>
                  {value.name}
                </NavDropdown.Item>
              ))}
            </NavDropdown>
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
                //className="mr-sm-2"
              />
              <Button
                style={{ marginLeft: 5 }}
                variant="outline-success"
                onClick={() => {
                  this.props.history.push("/search_product");
                }}
              >
                Search
              </Button>
            </Form>
          </Nav>
        </Navbar.Collapse>
        <BiCartAlt
          size={30}
          color={color.white}
          onClick={() => {
            this.props.history.push("/cart");
          }}
          style={{
            paddingLeft: 10,
            paddingRight: 10,
            width: 50,
            cursor: "pointer",
          }}
        />
      </Navbar>
    );
  }
}

export default withRouter(NavBar);
