import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { TextField, Button } from "@mui/material"

const SignupForm = ({ signup }) => {
  const [username, setUsername] = useState("")
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")

  const navigate = useNavigate()

  const handleLogin = (event) => {
    event.preventDefault()

    signup({ username, name, password })
    setUsername("")
    setName("")
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
          label="name"
          value={name}
          onChange={({ target }) => setName(target.value)}
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
        Sign up
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

export default SignupForm
