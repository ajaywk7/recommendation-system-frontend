import React, { Component } from "react";
import { Container, Form, Button, Col } from "react-bootstrap";
import { withRouter } from "react-router-dom";
import MyContext from "../context/myContext";
import { newOrder, paymentInitiate } from "../ApiHandlers/publicCalls";

function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

class OrderConfirm extends Component {
  static contextType = MyContext;
  constructor(props) {
    super(props);
    this.state = {
      name: localStorage.getItem("name") ?? "",
      phone: localStorage.getItem("phone") ?? "",
      address1: localStorage.getItem("address1") ?? "",
      address2: localStorage.getItem("address2") ?? "",
      city: localStorage.getItem("city") ?? "",
      state: localStorage.getItem("state") ?? "Tamil Nadu",
      zip: localStorage.getItem("zip") ?? "",
      error: "",
      success: false,
      payment: false,
      paymentSuccess: false,
      paymentResponse: {},
      order: {},
      states: [
        "Andhra Pradesh",
        "Arunachal Pradesh",
        "Assam",
        "Bihar",
        "Chhattisgarh",
        "Goa",
        "Gujarat",
        "Haryana",
        "Himachal Pradesh",
        "Jammu and Kashmir",
        "Jharkhand",
        "Karnataka",
        "Kerala",
        "Madhya Pradesh",
        "Maharashtra",
        "Manipur",
        "Meghalaya",
        "Mizoram",
        "Nagaland",
        "Odisha",
        "Punjab",
        "Rajasthan",
        "Sikkim",
        "Tamil Nadu",
        "Telangana",
        "Tripura",
        "Uttarakhand",
        "Uttar Pradesh",
        "West Bengal",
        "Andaman and Nicobar Islands",
        "Chandigarh",
        "Dadra and Nagar Haveli",
        "Daman and Diu",
        "Delhi",
        "Lakshadweep",
        "Puducherry",
      ],
    };
    this.responseGoogle = this.responseGoogle.bind(this);
    this.submit = this.submit.bind(this);
    this.displayRazorpay = this.displayRazorpay.bind(this);
    this.paymentSuccess = this.paymentSuccess.bind(this);
  }

  async responseGoogle(response) {
    //console.log(response);
    if (response.error) {
      alert("Something went wrong , try again");
    } else {
      await this.context.setId(response["profileObj"]);
      console.log(response["profileObj"]);
      this.props.history.goBack();
    }
  }

  async paymentSuccess(response) {
    console.log(3);
    var order = this.state.order;
    order.shippingDetails.paid = true;
    order.paymentResponse = {
      razorpay_payment_id: response.razorpay_payment_id,
      razorpay_order_id: response.razorpay_order_id,
      razorpay_signature: response.razorpay_signature,
    };
    await newOrder(order);
    await this.context.emptyCart();
    await this.props.history.push("/my_orders");
  }

  async displayRazorpay() {
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    const data = await paymentInitiate(this.context.cartTotal);

    console.log(data);

    const options = {
      key: "rzp_test_SZp0P0isnoUWrQ", //your razorpay id
      currency: data.currency,
      amount: data.amount.toString() ?? "200",
      order_id: data.id,
      name: "Order from bs-mart",
      description: "Thank you for your purchase !",
      image:
        "https://cdn0.iconfinder.com/data/icons/business-management-line-2/24/cash-512.png",
      handler: this.paymentSuccess,
      prefill: {
        contact: this.state.phone,
        name: this.state.name,
      },
    };
    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  }

  async submit(e) {
    e.preventDefault();
    localStorage.setItem("name", this.state.name);
    localStorage.setItem("phone", this.state.phone);
    localStorage.setItem("address1", this.state.address1);
    localStorage.setItem("address2", this.state.address2);
    localStorage.setItem("city", this.state.city);
    localStorage.setItem("state", this.state.state);
    localStorage.setItem("zip", this.state.zip);
    let order = {
      address: {
        name: this.state.name,
        phone: this.state.phone,
        address1: this.state.address1,
        address2: this.state.address2,
        city: this.state.city,
        state: this.state.state,
        zip: this.state.zip,
      },
      googleId: this.context.googleId,
      cartItems: this.context.cartItems,
      cartTotal: this.context.cartTotal,
      shippingDetails: {
        cashOnDelivery: true,
        status: "Processing",
        paid: false,
        lat: 11.0168,
        lon: 76.9558,
      },
    };
    await this.setState({
      order: order,
    });
    if (!this.state.payment) {
      await this.displayRazorpay();
      console.log("1");
      if (this.state.paymentSuccess) {
        console.log("2");
      }
    } else {
      await newOrder(this.state.order);
      await this.context.emptyCart();
      await this.props.history.push("/my_orders");
    }
  }

  render() {
    return (
      <Container
        className="h-100 w-100"
        style={{
          paddingLeft: 200,
          paddingRight: 200,
        }}
      >
        <br />
        <br />
        <br />

        <Form onSubmit={this.submit}>
          <Form.Row>
            <Form.Group
              as={Col}
              controlId="formGridName"
              value={this.state.name}
              onChange={(e) => this.setState({ name: e.target.value })}
            >
              <Form.Label>Name</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Enter name"
                defaultValue={this.state.name}
              />
            </Form.Group>

            <Form.Group
              as={Col}
              controlId="formGridPhone"
              value={this.state.phone}
              onChange={(e) => this.setState({ phone: e.target.value })}
            >
              <Form.Label>Phone</Form.Label>
              <Form.Control
                required
                pattern="[0-9]{10}"
                placeholder="Phone"
                title="enter valid phone"
                defaultValue={this.state.phone}
              />
            </Form.Group>
          </Form.Row>

          <Form.Group
            controlId="formGridAddress1"
            value={this.state.address1}
            onChange={(e) => this.setState({ address1: e.target.value })}
          >
            <Form.Label>Address</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="1234 Main St"
              defaultValue={this.state.address1}
            />
          </Form.Group>

          <Form.Group
            controlId="formGridAddress2"
            value={this.state.address2}
            onChange={(e) => this.setState({ address2: e.target.value })}
          >
            <Form.Label>Address 2</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Apartment, studio, or floor"
              defaultValue={this.state.address2}
            />
          </Form.Group>

          <Form.Row>
            <Form.Group
              as={Col}
              controlId="formGridCity"
              value={this.state.city}
              onChange={(e) => this.setState({ city: e.target.value })}
            >
              <Form.Label>City</Form.Label>
              <Form.Control required defaultValue={this.state.city} />
            </Form.Group>

            <Form.Group
              as={Col}
              controlId="formGridState"
              value={this.state.state}
              onChange={(e) => this.setState({ state: e.target.value })}
            >
              <Form.Label>City</Form.Label>
              <Form.Control
                required
                as="select"
                defaultValue={this.state.state}
              >
                {this.state.states.map((item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group
              as={Col}
              controlId="formGridZip"
              value={this.state.zip}
              onChange={(e) => this.setState({ zip: e.target.value })}
            >
              <Form.Label>Zip</Form.Label>
              <Form.Control
                type="number"
                pattern="[0-9]{6}"
                required
                defaultValue={this.state.zip}
              />
            </Form.Group>
          </Form.Row>

          <Form.Group id="formGridCheckbox">
            <Form.Check
              type="checkbox"
              value={this.state.payment}
              onClick={(e) => this.setState({ payment: !this.state.payment })}
              //disabled
              label="Cash on Delivery"
            />
          </Form.Group>

          <Button className="w-100" variant="primary" type="submit">
            {this.state.payment ? "PROCEED" : "PAY NOW"}
          </Button>
        </Form>
      </Container>
    );
  }
}

export default withRouter(OrderConfirm);
