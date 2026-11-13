import { Link } from "react-router-dom"
import Blog from "./Blog"

const BlogList = ({ blogs }) => {
  return (
    <div>
      <ul>
        {blogs.map((blog) => (
          <li key={blog.id}>
            <Link to={`/blogs/${blog.id}`}>
              {blog.title} by {blog.author}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default BlogList
