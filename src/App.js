import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Container } from "react-bootstrap";
import NavBar from "./pages/common/NavBar";
import MyProvider from "./context/myProvider";
import Homepage from "./pages/hompage";
import ProductList from "./pages/productList";
import ViewProduct from "./pages/viewProduct";
import Cart from "./pages/cart";
import Login from "./pages/login";
import OrderConfirm from "./pages/orderConfirm";
import MyOrders from "./pages/myOrders";
import TrackOrder from "./pages/trackOrder";
import Dashboard from "./pages/dashboard";

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
            <Route
              exact
              path="/category/:category"
              component={ProductList}
              key={2}
            />
            <Route exact path="/search" component={ProductList} key={1} />
            <Route exact path="/wishlist" component={ProductList} key={3} />
            <Route exact path="/view_product" component={ViewProduct} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/order_confirm" component={OrderConfirm} />
            <Route exact path="/my_orders" component={MyOrders} />
            <Route exact path="/track_order" component={TrackOrder} />
            <Route exact path="/cart" component={Cart} />
            <Route exact path="/dashboard" component={Dashboard} />
          </Switch>
        </Router>
      </Container>
    </MyProvider>
  );
}

export default App;
