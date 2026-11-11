import { useState } from "react"

const Blog = ({ blog, updateBlog }) => {
  const [showAll, setShowALl] = useState(false)
  // console.log(blog)

  let { title, author, url, likes, user, id } = blog

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
