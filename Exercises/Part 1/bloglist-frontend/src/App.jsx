import { useState, useEffect } from "react"
import blogService from "./services/blogs"
import loginService from "./services/login"
import Notification from "./components/Notification"
import BlogsForm from "./components/BlogsForm"
import LoginForm from "./components/LoginForm"
import Togglable from "./components/Togglable"
import BlogList from "./components/BlogList"

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
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

  const handleLogin = async (loginInfo) => {
    try {
      const user = await loginService.login(loginInfo)
      window.localStorage.setItem("loggedBlogAppUser", JSON.stringify(user))
      blogService.setToken(user.token)
      setSuccessMessage("Successfully logged in")
      setUser(user)
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
      console.log("bloggg  ", blog)
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
      console.log(blogs)
      setBlogs((blogs) => blogs.filter((b) => b.id !== id))
      console.log(blogs)
      setSuccessMessage(`Blog deleted`)
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
    setSuccessMessage("Successfully logged out")
    setTimeout(() => {
      setSuccessMessage(null)
    }, 1000)
  }

  const loginForm = () => {
    return (
      <Togglable buttonLabel="login">
        <LoginForm login={handleLogin} />
      </Togglable>
    )
  }

  const blogsList = () => (
    <div>
      <BlogList
        blogs={blogs}
        updateBlog={handleLike}
        deleteBlog={handleDelete}
      />
    </div>
  )

  const blogsForm = () => {
    return (
      <Togglable buttonLabel="create new blog">
        <BlogsForm createBlog={handleBlogCreate} />
      </Togglable>
    )
  }

  return (
    <div>
      <h1>Blogs</h1>
      {!user && <div>{loginForm()}</div>}
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
