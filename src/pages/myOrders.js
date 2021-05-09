import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Container, Row, Card, Col, Table, Button } from "react-bootstrap";
import Loader from "react-loader-spinner";
import { getOrders } from "../ApiHandlers/publicCalls";

import MyContext from "../context/myContext";
import { getAT } from "../context/auth";

class MyOrders extends Component {
  static contextType = MyContext;
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      orders: [],
    };
    this.renderOrders = this.renderOrders.bind(this);
  }

  async componentDidMount() {
    let googleId = await getAT();
    console.log("myOrders :" + googleId);
    if (googleId === "") {
      await this.props.history.push("/");
    } else {
      let orders = await getOrders(googleId);
      this.setState({
        orders: orders,
      });
    }
  }

  renderOrders = () =>
    this.state.orders.map((value, num) => (
      <Card className="w-100 m-2" key={value.orderId}>
        <Card.Header>
          <Row>
            <Col>
              <h7>
                {" "}
                <span className="font-weight-bold">{"order id : "} </span>{" "}
                {value.orderId}{" "}
              </h7>{" "}
            </Col>
            <Col>
              <h5 className="text-center "> {value.createdAt} </h5>{" "}
            </Col>
          </Row>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Product Name</th>
                    <th>price</th>
                    <th>Qty</th>
                    <th>SubTotal</th>
                  </tr>
                </thead>
                <tbody>
                  {value.cartItems.map((value, key) => (
                    <tr>
                      <td>{value.name}</td>
                      <td>₹ {value.price}</td>
                      <td>{value.qty} no</td>
                      <td>₹ {value.price * value.qty}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Col>
            <Col float="center">
              <br />
              <Row>
                <Col xs={3}></Col>
                <Col className="w-100">
                  <h3
                    className="text-center "
                    style={{
                      color: "",
                    }}
                  >
                    {" "}
                    Total : ₹ {value.cartTotal}
                  </h3>
                  <h3 className="text-center ">
                    {" "}
                    Status :{" "}
                    <span
                      style={{
                        color: "#228B22",
                      }}
                    >
                      {value.shippingDetails.status}
                    </span>
                  </h3>
                </Col>
                <Col xs={3}></Col>
              </Row>
              {value.shippingDetails.status === "Shipped" && (
                <Row>
                  <Col xs={3}></Col>

                  <Col>
                    <Button
                      onClick={() => {
                        this.props.history.push({
                          pathname: "/track_order",
                          state: {
                            order: value,
                          },
                        });
                      }}
                      className="w-100"
                    >
                      Track Order
                    </Button>
                  </Col>
                  <Col xs={3}></Col>
                </Row>
              )}
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
        <h1 className="text-center">
          You have not placed any orders yet ¯\_(ツ)_/¯{" "}
        </h1>
      </Container>
    );
  };

  render() {
    return (
      <div>
        <Container>
          {this.state.orders.length > 0 && (
            <div>
              <br />
              <Row className="pt-4 pb-5">{this.renderOrders()}</Row>
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
          {this.state.orders.length < 1 && this.noResults()}
        </Container>
      </div>
    );
  }
}

export default withRouter(MyOrders);
