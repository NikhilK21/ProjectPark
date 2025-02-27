import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, TextField, Button, Typography, Paper } from "@mui/material";
import axios from "axios";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        username,
        password,
      });

      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      alert("Login failed! Check credentials.");
    }
  };

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} sx={{ padding: 3, marginTop: 8 }}>
        <Typography variant="h5" textAlign="center">Admin Login</Typography>
        <TextField fullWidth margin="normal" label="Username" onChange={(e) => setUsername(e.target.value)} />
        <TextField fullWidth margin="normal" type="password" label="Password" onChange={(e) => setPassword(e.target.value)} />
        <Button fullWidth variant="contained" color="primary" onClick={handleLogin}>Login</Button>
      </Paper>
    </Container>
  );
}

export default Login;
