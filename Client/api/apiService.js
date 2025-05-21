import api from "./siteConfig";

export default {
  signUp(data) {
    return api.post("/auth/signup", data);
  },

  verifyOtp(data) {
    return api.post("/auth/verify-otp", data);
  },

  signIn(data) {
    return api.post("/auth/sign-in", data);
  },

  profile(){
    return api.get("/users/profile");
  },

  getUsers(){
    return api.get("/users")
  },

  addProduct(data) {
    return api.post("/products/add-product", data);
  },

  addReview(data) {
    return api.post("/products/add-review", data);
  },

    getReviews(productId) {
    return api.get(`/products/product-reviews/${productId}`);
  },

  fetchAllProducts(data) {
    return api.post("/products/all-products",data);
  },

  productDetails(id) {
    return api.get(`/products/product-details/${id}`);
  },

  addToCart(data){
    return api.post("cart/add-to-cart" , data);
  },

  removeFromCart(productId) {
    return api.delete(`cart/remove/${productId}`);
  },

  cartList() {
    return api.get("cart");
  },

  addWatchList(data) {
    return api.post("watchlist/add", data);
  },

  getWatchList() {
    return api.get("watchlist");
  },
  
  removeFromWatchList(productId) {
    return api.delete(`watchlist/remove/${productId}`);
  },

  createOrder(data) {
    return api.post("orders", data);
  },
  
  getOrders(){
    return api.get('/orders/getOrders');
  },
  
  summary(){
    return api.get('/stats/summary');
  }

};
