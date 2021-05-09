import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Container, Row, Card, Button, Col } from "react-bootstrap";
import { getProdWCat } from "../ApiHandlers/publicCalls";
import StarRatings from "react-star-ratings";
import {
  AiOutlineHeart,
  AiFillHeart,
  AiFillMinusCircle,
  AiFillPlusCircle,
} from "react-icons/ai";
import MyContext from "../context/myContext";

class ProductList extends Component {
  static contextType = MyContext;
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      category: "groceries",
      width: 0,
      height: 0,
      result: [],
    };
    this.renderProducts = this.renderProducts.bind(this);
  }

  renderProducts = () =>
    this.state.result.map((value, num) => (
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
              >
                {this.context.wishlist.includes(value.name) ? (
                  <AiFillHeart
                    size={20}
                    color={"#FF0000"}
                    onClick={() =>
                      this.context.addToWishlist(value.name, false)
                    }
                  />
                ) : (
                  <AiOutlineHeart
                    size={20}
                    onClick={() => this.context.addToWishlist(value.name, true)}
                  />
                )}
              </Col>
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
              <Col sm={8}>
                <StarRatings
                  rating={value.rating}
                  starRatedColor="gold"
                  changeRating={this.changeRating}
                  numberOfStars={5}
                  name="rating"
                  starDimension="20px"
                  starSpacing="2px"
                />
              </Col>
            </Row>
            <Row className="pb-2">
              {this.context.cart.includes(value.name) ? (
                <Col>
                  <Row>
                    <Col cs={3}></Col>
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
                    <Col cs={3}></Col>
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
          </Card.Body>
        </Card>
      </Col>
    ));

  noResults = () => {
    return (
      <Container
        fluid
        className="pt-10 justify-content-center align-items-center "
        style={{ height: 600 }}
      >
        <h1 className="text-center">No Results Found :(</h1>
      </Container>
    );
  };

  searchFunction = async (e) => {
    const response = await fetch("http://127.0.0.1:5000/", {
      method: "POST",
      body: JSON.stringify({
        search: this.state.search,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    const data = await response.json();
    return data.result;
  };

  async componentDidMount() {
    const { category } = this.props.match.params;

    console.log("sel " + category);
    var result = await getProdWCat(category);
    console.log(result);
    await this.setState({
      result: result,
    });
  }

  render() {
    return (
      <div>
        <Container>
          {this.state.result.length > 0 ? (
            <Row className="pt-4 pb-5">{this.renderProducts()}</Row>
          ) : (
            this.noResults()
          )}
        </Container>
      </div>
    );
  }
}

export default withRouter(ProductList);
