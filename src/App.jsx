import { Button } from "@mui/material";
import { Link } from "react-router-dom";

function App() {
  return (
    <>
      <div className="App">
        <h1>Hello World!</h1>
      </div>
      <Button component={Link} to="/about" variant="outlined">
        About
      </Button>
    </>
  );
}

export default App;