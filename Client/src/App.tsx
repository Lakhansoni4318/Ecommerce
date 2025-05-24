import { BrowserRouter as Router } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import AppRoutesWithAuthCheck from "./AppRoutesWithAuthCheck";

const App = () => {
  return (
    <Router>
      <AppRoutesWithAuthCheck />
    </Router>
  );
};

export default App;
