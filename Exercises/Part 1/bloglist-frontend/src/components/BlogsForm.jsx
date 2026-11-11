import { useState } from "react"

const BlogsForm = ({ createBlog }) => {
  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [url, setUrl] = useState("")

  const handleBlogCreate = (event) => {
    event.preventDefault()

    createBlog({ title, author, url })
    setTitle("")
    setAuthor("")
    setUrl("")
  }

  return (
    <form onSubmit={handleBlogCreate}>
      <div>
        <h3>Create new blog</h3>
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
      <button type="submit">Save</button>
    </form>
  )
}

export default BlogsForm
