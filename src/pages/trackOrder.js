import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { FaTruck } from "react-icons/fa";
import ReactMapGL, { Marker } from "react-map-gl";

import MyContext from "../context/myContext";

class TrackOrder extends Component {
  static contextType = MyContext;
  constructor(props) {
    super(props);
    this.state = {
      lat: 0,
      lon: 0,
      viewport: {
        width: "100vw",
        height: "100vh",
        latitude: 11.1271,
        longitude: 78.6569,
        zoom: 8,
      },
    };
  }

  async componentDidMount() {
    var order = this.props.location.state.order;
    var viewprt = this.state.viewport;
    viewprt.latitude = parseFloat(order.shippingDetails.lat);
    viewprt.longitude = parseFloat(order.shippingDetails.lon);
    console.log(order);
    await this.setState({
      lat: parseFloat(order.shippingDetails.lat),
      lon: parseFloat(order.shippingDetails.lon),
      date: order.shippingDetails.date,
      viewprt: viewprt,
    });
  }

  render() {
    
    return (
      <div>
        <h6 className="text-center">
          {" "}
          Delivery expected in {this.state.date}{" "}
        </h6>
        <ReactMapGL
          {...this.state.viewport}
          mapStyle="mapbox://styles/mapbox/streets-v11"
          onViewportChange={(viewport) => this.setState({ viewport })}
          mapboxApiAccessToken="pk.eyJ1IjoiYWpheXdrNyIsImEiOiJja2dybHIyMWswZzRiMnhxd2ZiMnZqbTJuIn0.HXxJurWRUl7oxu-G8R1wsQ"
        >
          <Marker latitude={this.state.lat} longitude={this.state.lon}>
            <FaTruck size={40} color={"#FF0000"} />
          </Marker>
        </ReactMapGL>
      </div>
    );
  }
}

export default withRouter(TrackOrder);
