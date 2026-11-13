import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { TextField, Button } from "@mui/material"

const LoginForm = ({ login }) => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const navigate = useNavigate()

  const handleLogin = (event) => {
    event.preventDefault()

    login({ username, password })
    setUsername("")
    setPassword("")
    navigate("/")
  }

  return (
    <form onSubmit={handleLogin}>
      <div>
        <TextField
          label="username"
          value={username}
          onChange={({ target }) => setUsername(target.value)}
          margin="dense"
          size="small"
        />
      </div>
      <div>
        <TextField
          label="password"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
          margin="dense"
          size="small"
        />
      </div>
      <Button type="submit" variant="contained" style={{ marginTop: 10 }}>
        Log in
      </Button>
      {/* <div>
        <label>
          username
          <input
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          password
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </label>
      </div>
      <button type="submit">login</button> */}
    </form>
  )
}

export default LoginForm
