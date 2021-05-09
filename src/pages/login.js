import React, { Component } from "react";
import { Container } from "react-bootstrap";
import { withRouter } from "react-router-dom";
import { GoogleLogin } from "react-google-login";
import { googleClientId } from "../config/urls";
import MyContext from "../context/myContext";

class Login extends Component {
  static contextType = MyContext;
  constructor(props) {
    super(props);
    this.state = {
      login: true,
      total: 0,
    };
    this.responseGoogle = this.responseGoogle.bind(this);
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

  render() {
    return (
      <Container
        className="h-100 w-100"
        style={{
          paddingLeft: 200,
          paddingRight: 200,
        }}
      >
        <form>
          <br />
          <br />

          <br />

          <h3>Login With your google account !</h3>

          <GoogleLogin
            className="w-100"
            clientId={googleClientId}
            buttonText="Login to continue"
            onSuccess={this.responseGoogle}
            onFailure={this.responseGoogle}
            cookiePolicy={"single_host_origin"}
          />
        </form>
      </Container>
    );
  }
}

export default withRouter(Login);
