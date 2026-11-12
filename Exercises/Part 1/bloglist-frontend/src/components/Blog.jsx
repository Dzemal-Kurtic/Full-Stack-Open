import { useState } from "react"

const Blog = ({ blog, updateBlog, deleteBlog }) => {
  const [showAll, setShowALl] = useState(false)
  console.log("whole  ", blog)

  let { title, author, url, likes, id, user } = blog

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 5,
    paddingBottom: 10,
    border: "solid",
    borderWidth: 2,
    marginTop: 5,
    marginBottom: 5,
  }

  const handleLike = () => {
    likes = likes + 1
    updateBlog({ title, author, url, likes, id })
  }

  const handleDelete = () => {
    deleteBlog(id)
  }

  if (showAll) {
    return (
      <div style={blogStyle}>
        <div>
          {title}
          <button onClick={() => setShowALl(!showAll)}>Hide</button>
        </div>
        <div>{author}</div>
        <div>{url}</div>
        <div>
          {likes} likes
          <button onClick={handleLike}>Like</button>
        </div>
        <div>{user.name}</div>
        <button onClick={handleDelete}>Remove</button>
      </div>
    )
  }

  return (
    <div style={blogStyle}>
      {title} {author}
      <button onClick={() => setShowALl(!showAll)}>View detail</button>
    </div>
  )
}

export default Blog
