import api from "./siteConfig";

export default {
  signUp(data: any) {
    return api.post("/auth/signup", data);
  },

  verifyOtp(data: any) {
    return api.post("/auth/verify-otp", data);
  },

  signIn(data: any) {
    return api.post("/auth/sign-in", data);
  },

  profile() {
    return api.get("/users/profile");
  },

  validateToken() {
    return api.get("/users/check-token");
  },

  getUsers() {
    return api.get("/users");
  },

  updateProfile(data: any) {
    return api.put("/users/profile",data);
  },

  addProduct(data: any) {
    return api.post("/products/add-product", data);
  },

  addReview(data: any) {
    return api.post("/products/add-review", data);
  },

  getReviews(productId: any) {
    return api.get(`/products/product-reviews/${productId}`);
  },

  getAllReviews() {
    return api.get(`/products/reviews`);
  },

  fetchAllProducts(data: any) {
    return api.post("/products/all-products", data);
  },

  deleteProduct(productId: any) {
    return api.delete(`products/${productId}`);
  },

  updateProduct(productId: string, updatedData: any) {
    return api.put(`/products/${productId}`, updatedData);
  },
  productDetails(id: any) {
    return api.get(`/products/product-details/${id}`);
  },

  getCategoryStats() {
    return api.get("/products/category-stats");
  },

  productCartDetails(id: any) {
    return api.post(`/products/products-details`, id);
  },

  addToCart(data: any) {
    return api.post("cart/add-to-cart", data);
  },

  removeFromCart(productId: any) {
    return api.delete(`cart/remove/${productId}`);
  },

  getCart() {
    return api.get("/cart");
  },

  updateCart(data: any) {
    return api.put("cart/update", data);
  },

  addWatchList(data: any) {
    return api.post("Wishlist/add", data);
  },

  getWatchList() {
    return api.get("Wishlist");
  },

  removeFromWatchList(productId: any) {
    return api.delete(`Wishlist/remove/${productId}`);
  },

  createOrder(data: any) {
    return api.post("orders", data);
  },

  getOrders() {
    return api.get("/orders/getOrders");
  },

  summary() {
    return api.get("/stats/summary");
  },
};
