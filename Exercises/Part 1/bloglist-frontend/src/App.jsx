import { useState, useEffect } from "react"
import { Link, Routes, Route, useNavigate, useMatch } from "react-router-dom"
import { AppBar, Container, Toolbar } from "@mui/material"
import { Button } from "@mui/material"
import blogService from "./services/blogs"
import loginService from "./services/login"
import signupService from "./services/signup"
import Notification from "./components/Notification"
import BlogsForm from "./components/BlogsForm"
import LoginForm from "./components/LoginForm"
import SignupForm from "./components/SignupForm"
import BlogList from "./components/BlogList"
import Blog from "./components/Blog"

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [notification, setNotification] = useState(null)
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

  const handleSignup = async (credentials) => {
    try {
      const user = await signupService.signup(credentials)
      if (user) {
        setNotification({
          text: `You signed up successfully. Please log into your account`,
        })
        navigate("/")
        setTimeout(() => {
          setNotification(null)
        }, 3000)
      }
    } catch {
      setNotification({ text: "wrong credentials", type: "error" })
      setTimeout(() => {
        setNotification(null)
      }, 2000)
    }
  }

  const handleLogin = async (loginInfo) => {
    try {
      const user = await loginService.login(loginInfo)
      window.localStorage.setItem("loggedBlogAppUser", JSON.stringify(user))
      blogService.setToken(user.token)
      setNotification({ text: "Logged in", type: "success" })
      setUser(user)
      navigate("/")
      setTimeout(() => {
        setNotification(null)
      }, 2000)
    } catch {
      setNotification({ text: "wrong credentials", type: "error" })
      setTimeout(() => {
        setNotification(null)
      }, 2000)
    }
  }

  const handleBlogCreate = async (blogInfo) => {
    try {
      const blog = await blogService.create(blogInfo)
      setBlogs((blogs) => blogs.concat(blog))
      setNotification({ text: `Blog '${blog.title}' created`, type: "success" })
      navigate("/")
      setTimeout(() => {
        setNotification(null)
      }, 2000)
    } catch {
      setNotification({ text: "Can't create blog", type: "error" })
      setTimeout(() => {
        setNotification(null)
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
      setNotification(`Blog '${blog.title}' updated`)
      setTimeout(() => {
        setNotification(null)
      }, 2000)
    } catch {
      setNotification({ text: "Can't update blog", type: "error" })
      setTimeout(() => {
        setNotification(null)
      }, 2000)
    }
  }

  const handleDelete = async (id) => {
    try {
      await blogService.remove(id)
      setBlogs((blogs) => blogs.filter((b) => b.id !== id))
      setNotification({ text: `Blog deleted`, type: "success" })
      navigate("/")
      setTimeout(() => {
        setNotification(null)
      }, 2000)
    } catch {
      setNotification({ text: "Can't delete blog", type: "error" })
      setTimeout(() => {
        setNotification(null)
      }, 2000)
    }
  }

  const logout = () => {
    window.localStorage.removeItem("loggedBlogAppUser")
    setUser(null)
    blogService.setToken(null)
    setNotification({ text: "Successfully logged out", type: "success" })
    setTimeout(() => {
      setNotification(null)
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
          </div>
          {!user && (
            <div>
              <Button
                color="inherit"
                sx={hoverStyle}
                component={Link}
                to="/login"
              >
                Log in
              </Button>
              <Button
                color="inherit"
                sx={hoverStyle}
                component={Link}
                to="/signup"
              >
                Sign up
              </Button>
            </div>
          )}

          {user && (
            <div>
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
            </div>
          )}
        </Toolbar>
      </AppBar>

      <Notification notification={notification} />

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
        <Route path="/signup" element={<SignupForm signup={handleSignup} />} />
        <Route path="/login" element={<LoginForm login={handleLogin} />} />
        <Route
          path="/create"
          element={<BlogsForm createBlog={handleBlogCreate} />}
        />
      </Routes>
    </Container>
  )
}

export default App
