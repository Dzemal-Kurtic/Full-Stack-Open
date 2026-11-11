import { useState, useEffect } from "react"
import Blog from "./components/Blog"
import Notification from "./components/Notification"
import blogService from "./services/blogs"
import loginService from "./services/login"

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [url, setUrl] = useState("")
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogAppUser")
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem("loggedBlogAppUser", JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername("")
      setPassword("")
      setSuccessMessage("Successfully logged in")
      setTimeout(() => {
        setSuccessMessage(null)
      }, 1000)
    } catch {
      setErrorMessage("wrong credentials")
      setTimeout(() => {
        setErrorMessage(null)
      }, 2000)
    }
  }

  const handleBlogCreate = async (event) => {
    event.preventDefault()
    try {
      const blog = await blogService.create({ title, author, url })
      setBlogs((blogs) => blogs.concat(blog))
      setTitle("")
      setAuthor("")
      setUrl("")
      setSuccessMessage(`Blog '${blog.title}' created`)
      setTimeout(() => {
        setSuccessMessage(null)
      }, 1000)
    } catch {
      setErrorMessage("can't create blog")
      setTimeout(() => {
        setErrorMessage(null)
      }, 2000)
    }
  }

  const logout = () => {
    window.localStorage.removeItem("loggedBlogAppUser")
    setUser(null)
    setSuccessMessage("Successfully logged out")
    setTimeout(() => {
      setSuccessMessage(null)
    }, 1000)
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
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
      <button type="submit">login</button>
    </form>
  )

  const blogsList = () => (
    <div>
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  )

  const blogsForm = () => {
    return (
      <form onSubmit={handleBlogCreate}>
        <div>
          <h3>create new</h3>
          <div>
            <label>
              title
              <input
                type="text"
                value={title}
                onChange={({ target }) => setTitle(target.value)}
              />
            </label>
          </div>
          <div>
            <label>
              author
              <input
                type="text"
                value={author}
                onChange={({ target }) => setAuthor(target.value)}
              />
            </label>
          </div>
          <div>
            <label>
              url
              <input
                type="text"
                value={url}
                onChange={({ target }) => setUrl(target.value)}
              />
            </label>
          </div>
        </div>
        <button type="submit">Create a blog</button>
      </form>
    )
  }

  return (
    <div>
      {/* {!user && loginForm()} */}
      {!user && (
        <div>
          <h2>login</h2>
          {loginForm()}
        </div>
      )}
      {user && (
        <div>
          <p>{user.name} logged in</p>
          <p>
            <button onClick={logout}>logout</button>
          </p>
          {blogsForm()}
          {blogsList()}
        </div>
      )}
      <Notification message={errorMessage} type={"error"} />
      <Notification message={successMessage} type={"success"} />
    </div>
  )
}

export default App
