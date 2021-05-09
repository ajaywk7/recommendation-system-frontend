import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Container, Row, Col, Image, Button, Card } from "react-bootstrap";
import StarRatings from "react-star-ratings";
import MyContext from "../context/myContext";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Slider from "react-slick";

import {
  AiOutlineHeart,
  AiFillHeart,
  AiFillMinusCircle,
  AiFillPlusCircle,
} from "react-icons/ai";
import { recommendProducts } from "../ApiHandlers/publicCalls";

class Viewproduct extends Component {
  static contextType = MyContext;
  constructor(props) {
    super(props);
    this.state = {
      data: "",
      images: [],
      result: [],
    };
    this.renderProducts = this.renderProducts.bind(this);
  }

  async update(data) {
    var result = await recommendProducts(data.name);
    await this.setState({
      data: data,
      images: data.images,
      result: result,
    });
  }

  async componentDidMount() {
    var data = this.props.location.state.data;
    //var images = await this.images();
    var result = await recommendProducts(data.name);
    console.log(result.length);
    await this.setState({
      data: data,
      images: data.images,
      result: result,
    });
    console.log(this.state.images);
  }

  async componentDidUpdate() {}

  renderProducts = () =>
    this.state.result.map((value, num) => (
      <div
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
            onClick={() => this.update(value)}
          />

          <Card.Body>
            <Row>
              <Col>
                <h7 className=" font-alegreya font-weight-bold  text-dark">
                  {value.name.slice(0, 15)} {value.name.length > 15 && "..."}
                </h7>
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
                    fontSize: 13,
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
      </div>
    ));

  onChange = (e) => {};

  buy = async () => {};

  addComment = async () => {};

  async urlFunc(link) {
    return {
      url: link,
    };
  }

  render() {
    return (
      <div>
        <Container>
          <br />
          <br />

          <h1 className="display-4 text-left font-weight-bold text-dark">
            {this.state.data.name}
            {"   "}

            {this.context.wishlist.includes(this.state.data.name) ? (
              <AiFillHeart
                size={50}
                color={"#FF0000"}
                onClick={() =>
                  this.context.addToWishlist(this.state.data.name, false)
                }
              />
            ) : (
              <AiOutlineHeart
                size={50}
                onClick={() =>
                  this.context.addToWishlist(this.state.data.name, true)
                }
              />
            )}
          </h1>
          <br />
          <Row>
            <Col sm={12} md={6}>
              <Slider
                dots={false}
                slidesToShow={1}
                slidesToScroll={1}
                infinite={true}
                //autoplay={true}
                //autoplaySpeed={3000}
                arrows={true}
                style={{
                  marginRight: 50,
                  marginLeft: 50,
                }}
              >
                {this.state.images.map((value, key) => (
                  <Image
                    key={key}
                    className=" d-block ml-auto mr-auto"
                    src={value}
                    style={{ height: 400, width: 500, objectFit: "contain" }}
                  />
                ))}
              </Slider>
              {/*
               <Image
                className=" d-block ml-auto mr-auto"
                src={this.state.data.image}
                style={{ height: 400, width: 500, objectFit: "contain" }}
              />*/}
            </Col>
            <Col
              className="d-flex flex-row justify-content-center align-items-center"
              sm={12}
              md={6}
            >
              <div>
                <h1 className="display-5 text-center font-weight-bold text-dark">
                  ₹ {this.state.data.price}{" "}
                </h1>
                <h1 className="display-5 text-center font-weight-bold text-dark">
                  <StarRatings
                    rating={this.state.data.rating}
                    starRatedColor="gold"
                    changeRating={this.changeRating}
                    numberOfStars={5}
                    name="rating"
                    starDimension="30px"
                    starSpacing="2px"
                  />
                </h1>
                <br />
                {this.context.cart.includes(this.state.data.name) ? (
                  <Col>
                    <Row>
                      <Col cs={3}></Col>
                      <Col>
                        <AiFillPlusCircle
                          size={30}
                          color={"#228B22"}
                          onClick={() =>
                            this.context.addToCart(this.state.data)
                          }
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
                              this.context.cart.indexOf(this.state.data.name)
                            ]["qty"]
                          }
                        </h6>
                      </Col>
                      <Col>
                        <AiFillMinusCircle
                          color={"#FF0000"}
                          size={30}
                          onClick={() =>
                            this.context.removeFromCart(this.state.data)
                          }
                        />
                      </Col>
                      <Col cs={3}></Col>
                    </Row>
                  </Col>
                ) : (
                  <Col>
                    <Button
                      className="w-100 m-0 "
                      onClick={() => this.context.addToCart(this.state.data)}
                    >
                      Add to cart
                    </Button>
                  </Col>
                )}
                <br />
                <Button
                  className="w-100"
                  onClick={() => this.props.history.push("/cart")}
                >
                  Go to cart
                </Button>
                <br />
                {""}
              </div>
            </Col>
          </Row>
          <br />

          <Row>
            <Col sm={12}>
              <p>
                {this.state.data.description ??
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."}
              </p>
            </Col>
          </Row>
          {this.state.result.length > 0 && (
            <div style={{ paddingTop: 30 }}>
              <h5>Similar Products </h5>

              <Slider
                dots={false}
                slidesToShow={3}
                slidesToScroll={3}
                infinite={true}
                //autoplay={true}
                //autoplaySpeed={3000}
                arrows={true}
                style={{
                  paddingTop: 15,
                  marginBottom: 30,
                  marginRight: 50,
                  marginLeft: 50,
                }}
              >
                {this.renderProducts()}
              </Slider>
            </div>
          )}
        </Container>
      </div>
    );
  }
}

export default withRouter(Viewproduct);
