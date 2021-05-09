import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Container, Row, Card, Button, Col } from "react-bootstrap";
import Loader from "react-loader-spinner";

import { AiFillMinusCircle, AiFillPlusCircle } from "react-icons/ai";
import MyContext from "../context/myContext";

class Cart extends Component {
  static contextType = MyContext;
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      total: 0,
    };
    this.renderProducts = this.renderProducts.bind(this);
    this.checkout = this.checkout.bind(this);
  }

  renderProducts = () =>
    this.context.cartItems.map((value, num) => (
      <Card className="w-100 m-2" key={value.name}>
        <Card.Header as="h5">{value.name}</Card.Header>
        <Card.Body>
          <Row>
            <Col>
              <Card.Img
                className="d-block p-1 ml-auto mr-auto"
                src={value.image}
                variant="top"
                style={{ height: 170, width: "100%", objectFit: "contain" }}
                onClick={() =>
                  this.props.history.push({
                    pathname: "/view_product",
                    state: {
                      data: value,
                    },
                  })
                }
              />
            </Col>
            <Col float="center">
              <br />
              <Row>
                <Col xs={3}></Col>
                <Col className="w-100">
                  <h3 className="text-center">
                    {" "}
                    Subtotal : ₹ {value.qty * value.price}
                  </h3>
                </Col>
                <Col xs={3}></Col>
              </Row>
              <br />
              <Row>
                {this.context.cart.includes(value.name) ? (
                  <Col>
                    <Row>
                      <Col xs={4}></Col>
                      <Col>
                        <AiFillPlusCircle
                          size={30}
                          color={"#228B22"}
                          onClick={() => this.context.addToCart(value)}
                        />
                      </Col>
                      <Col>
                        <h6
                          style={{
                            textAlign: "center",
                            fontSize: 20,
                          }}
                        >
                          {
                            this.context.cartItems[
                              this.context.cart.indexOf(value.name)
                            ]["qty"]
                          }
                        </h6>
                      </Col>
                      <Col>
                        <AiFillMinusCircle
                          color={"#FF0000"}
                          size={30}
                          onClick={() => this.context.removeFromCart(value)}
                        />
                      </Col>
                      <Col xs={4}></Col>
                    </Row>
                  </Col>
                ) : (
                  <Col>
                    <Button
                      className="w-100 m-0 "
                      onClick={() => this.context.addToCart(value)}
                    >
                      Add to cart
                    </Button>
                  </Col>
                )}
              </Row>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    ));

  noResults = () => {
    return (
      <Container
        fluid
        className="pt-10 justify-content-center align-items-center "
        style={{ height: 600 }}
      >
        <h1 className="text-center">You dont have any products in cart</h1>
      </Container>
    );
  };

  async checkout() {
    if (this.context.googleId === "") {
      this.props.history.push({
        pathname: "/login",
      });
    } else {
      this.props.history.push({
        pathname: "/order_confirm",
      });
    }
  }

  render() {
    return (
      <div>
        <Container>
          {this.context.cartItems.length > 0 && (
            <div>
              <br />
              <Row>
                <Col>
                  <h3>total : ₹ {this.context.cartTotal}</h3>
                </Col>
                <Col>
                  <Button
                    className="w-100 m-0 "
                    onClick={this.checkout}
                    color=""
                  >
                    Checkout
                  </Button>
                </Col>
              </Row>

              <Row className="pt-4 pb-5">{this.renderProducts()}</Row>
            </div>
          )}
          {this.state.loading && (
            <Container
              fluid
              style={{
                alignItems: "center",
                width: "100%",
                justifyContent: "center",
                paddingTop: 50,
              }}
            >
              <Row>
                <Col></Col>
                <Col>
                  <Loader
                    className="mr-auto"
                    type="Oval"
                    color="#00BFFF"
                    height={100}
                    width={100}
                    timeout={3000} //3 secs
                  />
                </Col>
                <Col></Col>
              </Row>
            </Container>
          )}
          {this.context.cartItems.length < 1 && this.noResults()}
        </Container>
      </div>
    );
  }
}

export default withRouter(Cart);
