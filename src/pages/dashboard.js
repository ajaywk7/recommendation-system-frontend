import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import {
  Container,
  Tabs,
  Tab,
  Form,
  Button,
  Row,
  Card,
  Col,
  Table,
  Modal,
} from "react-bootstrap";

import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import MyContext from "../context/myContext";
import {
  getOrders,
  getProducts,
  updateOrder,
  updateProduct,
  deleteProduct,
} from "../ApiHandlers/admin";
import { getCategories } from "../ApiHandlers/publicCalls";
import { search } from "../ApiHandlers/publicCalls";

class Dashboard extends Component {
  static contextType = MyContext;
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      isAuth: false,
      orders: [],
      products: [],
      categories: [],
      selectedOrder: {},
      selectedProduct: {},
      deleteId: "",
      orderModalVisibile: false,
      productModalVisibile: false,
      deleteModalVisibile: false,
      orderEdit: false,
      productEdit: false,
      search: "",
    };
    this.auth = this.auth.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.editOrder = this.editOrder.bind(this);
    this.orderModalClose = this.orderModalClose.bind(this);
    this.editProduct = this.editProduct.bind(this);
    this.productModalClose = this.productModalClose.bind(this);
    this.searchProducts = this.searchProducts.bind(this);
    this.deleteProduct = this.deleteProduct.bind(this);
    this.deleteModalClose = this.deleteModalClose.bind(this);
  }

  async auth() {
    if (this.state.username === "admin" && this.state.password === "admin") {
      this.setState({
        isAuth: true,
      });
    } else {
      alert("invalid credentials !");
    }
    this.setState({
      username: "",
      password: "",
    });
  }

  async searchProducts() {
    if (this.state.search === "") {
      await this.fetchData();
    }
    let products = await search(this.state.search);
    this.setState({
      products: products,
    });
  }

  async fetchData() {
    let orders = await getOrders();
    let products = await getProducts();
    let categories = await getCategories();
    this.setState({
      orders: orders,
      products: products,
      categories: categories,
      orderModalVisibile: false,
      productModalVisibile: false,
    });
  }

  async componentDidMount() {
    await this.fetchData();
  }

  render() {
    if (!this.state.isAuth) {
      return (
        <Container>
          <Form>
            <Form.Group controlId="formGridName">
              <Form.Label>username</Form.Label>
              <Form.Control
                required
                type="text"
                value={this.state.username}
                onChange={(e) => this.setState({ username: e.target.value })}
                placeholder="username"
              />
            </Form.Group>

            <Form.Group controlId="formGridPhone">
              <Form.Label>password</Form.Label>
              <Form.Control
                required
                type="password"
                value={this.state.password}
                onChange={(e) => this.setState({ password: e.target.value })}
                placeholder="password"
              />
            </Form.Group>

            <Button onClick={this.auth}>Submit</Button>
          </Form>
        </Container>
      );
    }
    return (
      <div>
        <Container>
          {this.state.orderModalVisibile && (
            <OrderModal
              key={this.state.selectedOrder.orderId}
              orderModalClose={this.orderModalClose}
              orderModalVisibile={this.state.orderModalVisibile}
              selectedOrder={this.state.selectedOrder}
              fetchData={this.fetchData}
            />
          )}
          {this.state.productModalVisibile && (
            <ProductModal
              key={this.state.selectedProduct._id}
              productModalClose={this.productModalClose}
              productModalVisibile={this.state.productModalVisibile}
              selectedProduct={this.state.selectedProduct}
              fetchData={this.fetchData}
              categories={this.state.categories}
            />
          )}
          {this.state.deleteModalVisibile && (
            <ProductDeleteModal
              key={this.state.selectedProduct._id}
              deleteModalClose={this.deleteModalClose}
              deleteModalVisibile={this.state.deleteModalVisibile}
              selectedProduct={this.state.selectedProduct}
              fetchData={this.fetchData}
            />
          )}

          <Tabs defaultActiveKey="Orders" id="uncontrolled-tab-example">
            <Tab eventKey="Orders" title="Orders">
              <Row className="pt-4 pb-5">{this.renderOrders()}</Row>
            </Tab>
            <Tab eventKey="Products" title="Products">
              <br />
              <Row>
                <Col>
                  <Button onClick={() => this.editProduct({})}>
                    Create new Product
                  </Button>{" "}
                </Col>
                <Col>
                  <Form.Group controlId="formGridName">
                    <Form.Control
                      required
                      type="text"
                      value={this.state.search}
                      onChange={async (e) => {
                        await this.setState({ search: e.target.value });
                        await this.searchProducts();
                      }}
                      placeholder="search"
                      onSubmit={() => console.log("check")}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="pt-4 pb-5">{this.renderProducts()}</Row>
            </Tab>
          </Tabs>
        </Container>
      </div>
    );
  }

  async editProduct(value) {
    console.log(value);
    await this.setState({
      selectedProduct: value,
    });
    await this.setState({
      productModalVisibile: true,
    });
  }

  async deleteProduct(value) {
    console.log(value);
    await this.setState({
      selectedProduct: value,
    });
    await this.setState({
      deleteModalVisibile: true,
    });
  }

  async productModalClose() {
    await this.setState({
      productModalVisibile: false,
      selectedProduct: {},
    });
  }

  async deleteModalClose() {
    await this.setState({
      deleteModalVisibile: false,
      selectedProduct: {},
    });
  }

  renderProducts = () =>
    this.state.products.map((value, num) => (
      <Col
        key={value.name + num}
        //xl={2.7}
        lg={3}
        md={4}
        sm={6}
        xs={6}
        className="p-1 pt-2 pl-3 pr-3 "
        style={{ height: 330 }}
      >
        <Card
          className=" h-100 w-100 pointer-cursor d-flex"
          style={{
            boxShadow:
              "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 10px 25px 0 rgba(0, 0, 0, 0.19)",
            cursor: "pointer",
          }}
        >
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

          <Card.Body>
            <Row>
              <Col>
                <Card.Title className=" font-alegreya font-weight-bold  text-dark">
                  {value.name.slice(0, 100)} {value.length > 99 && "..."}
                </Card.Title>
              </Col>
              <Col
                xs={3}
                className="  justify-content-center align-items-center "
              ></Col>
            </Row>

            <Row className="pb-2">
              <Col sm={4}>
                <h6
                  style={{
                    fontSize: 18,
                    color: "#228B22",
                    paddingTop: 5,
                  }}
                >
                  ₹ {value.price}
                </h6>
              </Col>
              <Col sm={4}>
                <AiFillDelete
                  size={20}
                  color={"#ff0000"}
                  onClick={() => this.deleteProduct(value)}
                />
              </Col>
              <Col sm={4}>
                <AiFillEdit size={20} onClick={() => this.editProduct(value)} />
              </Col>
            </Row>
            <Row className="pb-2"></Row>
          </Card.Body>
        </Card>
      </Col>
    ));

  async editOrder(value) {
    console.log(value);
    await this.setState({
      selectedOrder: value,
    });
    await this.setState({
      orderModalVisibile: true,
    });
  }

  async orderModalClose() {
    this.setState({
      orderModalVisibile: false,
      selectedOrder: {},
    });
  }

  renderOrders = () =>
    this.state.orders.map((value, num) => (
      <Card className="w-100 m-2" key={value.orderId}>
        <Card.Header>
          <Row>
            <Col>
              {" "}
              <span className="font-weight-bold">
                {"ordered by google id : "}{" "}
              </span>{" "}
              {value.googleId}{" "}
            </Col>
            <Col>
              <Row>
                <Col xs={8}>
                  <h7 className="text-align-center pt-2">
                    {" "}
                    {value.createdAt}{" "}
                  </h7>{" "}
                </Col>
                <Col>
                  <Button
                    variant="dark"
                    onClick={() => alert(JSON.stringify(value.address))}
                  >
                    view address
                  </Button>
                </Col>
              </Row>
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
                    <tr key={key}>
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
              {value.shippingDetails.status !== "completed" && (
                <Button className="w-100" onClick={() => this.editOrder(value)}>
                  Edit Status
                </Button>
              )}
            </Col>
          </Row>
        </Card.Body>
      </Card>
    ));
}

class ProductDeleteModal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.update = this.update.bind(this);
  }

  async componentDidMount() {
    //console.log("varthu");
  }

  async update() {
    await deleteProduct(this.props.selectedProduct);
    await this.props.fetchData();
    await this.props.deleteModalClose();
  }

  render() {
    return (
      <Modal
        show={this.props.deleteModalVisibile}
        onHide={this.props.deleteModalClose}
      >
        <Modal.Header closeButton>
          <Modal.Title>{this.props.selectedProduct.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {" "}
          Are you sure you want to delete {
            this.props.selectedProduct.name
          } ?{" "}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary">cancel</Button>
          <Button variant="primary" color={"#ff0000"} onClick={this.update}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
class ProductModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.selectedProduct.name
        ? this.props.selectedProduct.name
        : "",
      price: this.props.selectedProduct.name
        ? this.props.selectedProduct.price
        : 0,
      category: this.props.selectedProduct.name
        ? this.props.selectedProduct.category
        : this.props.categories[0].name,
      image: this.props.selectedProduct.name
        ? this.props.selectedProduct.image
        : "",
      images: this.props.selectedProduct.name
        ? this.props.selectedProduct.images
        : "",
      description: this.props.selectedProduct.name
        ? this.props.selectedProduct.description
        : "",
    };
    this.update = this.update.bind(this);
  }

  async componentDidMount() {
    console.log(this.props.selectedProduct);
  }

  async update() {
    let product = this.props.selectedProduct;
    product.price = this.state.price;
    product.category = this.state.category;
    product.image = this.state.image;
    product.description = this.state.description;
    product.images =
      this.props.selectedProduct.images === this.state.images
        ? this.state.images
        : this.state.images.split(",");
    if (!this.props.selectedProduct.name) {
      product.name = this.state.name;
      product.rating = 4.2;
      product.shipping = true;
    }
    console.log("after");
    console.log(product);
    await updateProduct(product);
    await this.props.fetchData();
  }

  render() {
    return (
      <Modal
        size="lg"
        show={this.props.productModalVisibile}
        onHide={this.props.productModalClose}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {!this.props.selectedProduct.name ? "New Product" : this.state.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {!this.props.selectedProduct.name && (
            <Form.Group as={Col} controlId="name">
              <Form.Label>name</Form.Label>
              <Form.Control
                required
                type="text"
                value={this.state.name}
                onChange={(e) => this.setState({ name: e.target.value })}
                placeholder="Enter name"
              />
            </Form.Group>
          )}
          <Form.Row>
            <Form.Group as={Col} controlId="formGridName">
              <Form.Label>price</Form.Label>
              <Form.Control
                required
                type="number"
                value={this.state.price}
                onChange={(e) => this.setState({ price: e.target.value })}
                placeholder="Enter price"
              />
            </Form.Group>

            <Form.Group as={Col} controlId="formGridPhone">
              <Form.Label>category</Form.Label>
              <Form.Control
                as="select"
                size="lg"
                onChange={(e) =>
                  this.setState({
                    category: e.target.value,
                  })
                }
                defaultValue={this.state.category}
              >
                {this.props.categories.map((value, key) => (
                  <option>{value.name}</option>
                ))}
              </Form.Control>
            </Form.Group>
          </Form.Row>
          <Form.Group as={Col} controlId="formGridName">
            <Form.Label>image</Form.Label>
            <Form.Control
              required
              type="text"
              value={this.state.image}
              onChange={(e) => this.setState({ image: e.target.value })}
              placeholder="Enter image"
            />
          </Form.Group>
          <Form.Group as={Col} controlId="formGridName">
            <Form.Label>images</Form.Label>
            <Form.Control
              required
              as="textarea"
              rows={5}
              value={this.state.images}
              onChange={(e) => this.setState({ images: e.target.value })}
              placeholder="Enter images"
            />
          </Form.Group>
          <Form.Group as={Col} controlId="description">
            <Form.Label>description</Form.Label>
            <Form.Control
              required
              as="textarea"
              rows={3}
              value={this.state.description}
              onChange={(e) => this.setState({ description: e.target.value })}
              placeholder="Enter description"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.props.productModalClose}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={this.update}
            disabled={
              this.state.price === "" ||
              this.state.image === "" ||
              this.state.images === ""
                ? true
                : false
            }
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

class OrderModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: this.props.selectedOrder.shippingDetails
        ? this.props.selectedOrder.shippingDetails.status
        : "Processing",
      lat: this.props.selectedOrder.shippingDetails
        ? this.props.selectedOrder.shippingDetails.lat
        : 0,
      lon: this.props.selectedOrder.shippingDetails
        ? this.props.selectedOrder.shippingDetails.lon
        : 0,
      date: this.props.selectedOrder.shippingDetails.date
        ? this.props.selectedOrder.shippingDetails.date
        : "",
    };
    this.update = this.update.bind(this);
  }

  async componentDidMount() {
    //console.log("varthu");
  }

  async update() {
    let order = this.props.selectedOrder;
    order.shippingDetails.status = this.state.status;
    order.shippingDetails.lat = this.state.lat;
    order.shippingDetails.lon = this.state.lon;
    order.shippingDetails.date = this.state.date;
    console.log("after");
    console.log(order);
    await updateOrder(order);
    await this.props.fetchData();
    console.log("varthu");
  }

  render() {
    return (
      <Modal
        show={this.props.orderModalVisibile}
        onHide={this.props.orderModalClose}
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Control
              as="select"
              size="lg"
              onChange={(e) =>
                this.setState({
                  status: e.target.value,
                })
              }
              defaultValue={this.state.status}
            >
              <option>Processing</option>
              <option>Shipped</option>
              <option>completed</option>
              <option>Return Processing</option>
            </Form.Control>
            <br />
            {this.state.status === "Shipped" && (
              <Form.Row>
                <Form.Group as={Col} controlId="formGridName">
                  <Form.Label>lat</Form.Label>
                  <Form.Control
                    required
                    type="number"
                    value={this.state.lat}
                    onChange={(e) => this.setState({ lat: e.target.value })}
                    placeholder="Enter lat"
                  />
                </Form.Group>

                <Form.Group as={Col} controlId="formGridPhone">
                  <Form.Label>lon</Form.Label>
                  <Form.Control
                    required
                    type="number"
                    value={this.state.lon}
                    onChange={(e) => this.setState({ lon: e.target.value })}
                    placeholder="lon"
                  />
                </Form.Group>
                <Form.Group as={Col} controlId="date">
                  <Form.Label>Delivery date</Form.Label>
                  <Form.Control
                    required
                    type="date"
                    value={this.state.date}
                    onChange={(e) => this.setState({ date: e.target.value })}
                    placeholder="Delivery date"
                  />
                </Form.Group>
              </Form.Row>
            )}
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.props.orderModalClose}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={this.update}
            disabled={
              this.state.status === "Shipped" &&
              (this.state.lat === "" ||
                this.state.lon === "" ||
                this.state.date === "")
                ? true
                : false
            }
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default withRouter(Dashboard);
