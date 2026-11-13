import { useState, useEffect } from "react"
import { Link, Routes, Route, useNavigate, useMatch } from "react-router-dom"
import { AppBar, Container, Toolbar } from "@mui/material"
import { Button } from "@mui/material"
import blogService from "./services/blogs"
import loginService from "./services/login"
import Notification from "./components/Notification"
import BlogsForm from "./components/BlogsForm"
import LoginForm from "./components/LoginForm"
import BlogList from "./components/BlogList"
import Blog from "./components/Blog"

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [user, setUser] = useState(null)

  const navigate = useNavigate()
  const match = useMatch("/blogs/:id")
  const blog = match ? blogs.find((b) => b.id === match.params.id) : null

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

  const handleLogin = async (loginInfo) => {
    try {
      const user = await loginService.login(loginInfo)
      window.localStorage.setItem("loggedBlogAppUser", JSON.stringify(user))
      blogService.setToken(user.token)
      setSuccessMessage("Successfully logged in")
      setUser(user)
      navigate("/")
      setTimeout(() => {
        setSuccessMessage(null)
      }, 2000)
    } catch {
      setErrorMessage("wrong credentials")
      setTimeout(() => {
        setErrorMessage(null)
      }, 2000)
    }
  }

  const handleBlogCreate = async (blogInfo) => {
    try {
      const blog = await blogService.create(blogInfo)
      setBlogs((blogs) => blogs.concat(blog))
      setSuccessMessage(`Blog '${blog.title}' created`)
      navigate("/")
      setTimeout(() => {
        setSuccessMessage(null)
      }, 2000)
    } catch {
      setErrorMessage("can't create blog")
      setTimeout(() => {
        setErrorMessage(null)
      }, 2000)
    }
  }

  const handleLike = async ({ title, author, url, likes, id }) => {
    try {
      const newBlog = {
        title,
        author,
        url,
        likes,
      }
      const blog = await blogService.update(id, newBlog)
      setBlogs((blogs) => blogs.map((b) => (b.id === blog.id ? blog : b)))
      setSuccessMessage(`Blog '${blog.title}' updated`)
      setTimeout(() => {
        setSuccessMessage(null)
      }, 2000)
    } catch {
      setErrorMessage("can't update blog")
      setTimeout(() => {
        setErrorMessage(null)
      }, 2000)
    }
  }

  const handleDelete = async (id) => {
    try {
      await blogService.remove(id)
      setBlogs((blogs) => blogs.filter((b) => b.id !== id))
      setSuccessMessage(`Blog deleted`)
      navigate("/")
      setTimeout(() => {
        setSuccessMessage(null)
      }, 2000)
    } catch {
      setErrorMessage("can't delete blog")
      setTimeout(() => {
        setErrorMessage(null)
      }, 2000)
    }
  }

  const logout = () => {
    window.localStorage.removeItem("loggedBlogAppUser")
    setUser(null)
    blogService.setToken(null)
    setSuccessMessage("Successfully logged out")
    setTimeout(() => {
      setSuccessMessage(null)
    }, 1000)
    navigate("/")
  }

  const hoverStyle = { "&:hover": { bgcolor: "rgba(255,255,255,0.3)" } }

  return (
    <Container
      maxWidth="md"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <AppBar position="static">
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div>
            <Button color="inherit" sx={hoverStyle} component={Link} to="/">
              BLOGS
            </Button>
            {!user && (
              <Button
                color="inherit"
                sx={hoverStyle}
                component={Link}
                to="/login"
              >
                Log in
              </Button>
            )}
          </div>
          <div>
            {user && (
              <>
                <Button
                  color="inherit"
                  sx={hoverStyle}
                  component={Link}
                  to="/create"
                >
                  NEW BLOG
                </Button>
                <Button
                  color="inherit"
                  sx={hoverStyle}
                  component={Link}
                  onClick={logout}
                >
                  Log out
                </Button>
              </>
            )}
          </div>
        </Toolbar>
      </AppBar>
      {/* <div>
        <Link style={padding} to={"/"}>
          blogs
        </Link>
        {!user && (
          <Link style={padding} to={"/login"}>
            login
          </Link>
        )}
        {user && (
          <>
            <Link to={"/create"}>create new blog</Link>
            <button onClick={logout}>logout</button>
          </>
        )}
      </div> */}

      <Routes>
        <Route path="/" element={<BlogList blogs={blogs} />} />
        <Route
          path="/blogs/:id"
          element={
            <Blog
              blog={blog}
              loggedUser={user}
              updateBlog={handleLike}
              deleteBlog={handleDelete}
            />
          }
        />
        <Route path="/login" element={<LoginForm login={handleLogin} />} />
        <Route
          path="/create"
          element={<BlogsForm createBlog={handleBlogCreate} />}
        />
      </Routes>

      <Notification message={errorMessage} type={"error"} />
      <Notification message={successMessage} type={"success"} />
    </Container>
  )
}

export default App
