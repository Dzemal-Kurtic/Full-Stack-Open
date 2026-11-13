import { useState } from "react"
import { TextField, Button } from "@mui/material"

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
    <>
      <h3>Create new blog</h3>
      <form onSubmit={handleBlogCreate}>
        <div>
          <TextField
            label="title"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
            margin="dense"
            size="small"
          />
        </div>
        <div>
          <TextField
            label="author"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
            margin="dense"
            size="small"
          />
        </div>
        <div>
          <TextField
            label="url"
            value={url}
            onChange={({ target }) => setUrl(target.value)}
            margin="dense"
            size="small"
          />
        </div>
        <Button type="submit" variant="contained" style={{ marginTop: 10 }}>
          Save
        </Button>
        {/* <div>
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
        <button type="submit">Save</button> */}
      </form>
    </>
  )
}

export default BlogsForm
