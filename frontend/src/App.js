import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Container } from "react-bootstrap";
import NavBar from "./pages/common/NavBar";
import MyProvider from "./context/myProvider";
import Homepage from "./pages/hompage";
import ProductList from "./pages/productList";

function App() {
  return (
    <MyProvider>
      <Container className="p-0" fluid>
        <Router>
          <NavBar />
          <Switch>
            <Route exact path="/">
              <Homepage />
            </Route>
            <Route exact path="/category/:category" component={ProductList} />

            <Route exact path="/search_product">
              {" "}
              Search product{" "}
            </Route>
            <Route exact path="/cart">
              {" "}
              cart{" "}
            </Route>
          </Switch>
        </Router>
      </Container>
    </MyProvider>
  );
}

export default App;
