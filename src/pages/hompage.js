import React, { Component } from "react";
import "./styles.css";
import { Card, Carousel, Container } from "react-bootstrap";
import Font from "react-font";
//import ScrollMenu from "react-horizontal-scrolling-menu";
import { withRouter } from "react-router-dom";
//import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Slider from "react-slick";
import { getCategories } from "../ApiHandlers/publicCalls";

class Homepage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cats: [],
      width: 0,
      height: 0,
    };
    this.renderSlides = this.renderSlides.bind(this);
  }

  updateDimensions = () => {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  };
  async componentDidMount() {
    let cats = await getCategories();
    this.setState({
      cats: cats,
    });
    window.addEventListener("resize", this.updateDimensions);
    this.updateDimensions();
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  }

  renderSlides = () =>
    this.state.cats.map((value, num) => (
      <div onClick={() => console.log("clicked")} key={value + num}>
        <Card
          id="cat-card"
          onClick={() => this.props.history.push("/category/" + value.name)}
        >
          <Card.Img id="cat-img" variant="top" src={value.image} />
          <Card.Title
            style={{ alignSelf: "center", textAlign: "center", padding: 5 }}
          >
            {value.name}
          </Card.Title>
        </Card>
      </div>
    ));

  noofslides = () => {
    if (this.state.width > 992) {
      return 4;
    } else if (this.state.width < 992 && this.state.width > 800) {
      return 2;
    } else {
      return 1;
    }
  };

  render() {
    return (
      <Container fluid className="p-0">
        <Carousel>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="https://bingberry.s3.amazonaws.com/Carousel/groceries.jpg"
              alt="First slide"
              height="600"
              style={{
                objectFit: "cover",
              }}
            />
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="https://bingberry.s3.amazonaws.com/Carousel/groceries.jpg"
              alt="First slide"
              height="600"
              style={{
                objectFit: "cover",
              }}
            />
          </Carousel.Item>
        </Carousel>
        <Font family="Roboto">
          <h4
            style={{
              paddingTop: 30,
              fontWeight: "bold",
            }}
          >
            <center>SHOP BY CATEGORY</center>
          </h4>
        </Font>
        <Container
          style={{
            paddingLeft: 20,
            paddingRight: 20,
            paddingTop: 10,
          }}
        >
          <Slider
            dots={false}
            slidesToShow={this.noofslides()}
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
            {this.renderSlides()}
          </Slider>
        </Container>
      </Container>
    );
  }
}

export default withRouter(Homepage);
