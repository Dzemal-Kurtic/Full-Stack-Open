import { Link } from "react-router-dom"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material"

const BlogList = ({ blogs }) => {
  return (
    <div>
      <h1>Blogs</h1>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>title</TableCell>
              <TableCell>author</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {blogs.map((blog) => (
              <TableRow key={blog.id}>
                <TableCell>
                  <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
                </TableCell>
                <TableCell>
                  {" "}
                  <Link to={`/blogs/${blog.id}`}>{blog.author}</Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* <ul>
        {blogs.map((blog) => (
          <li key={blog.id}>
            <Link to={`/blogs/${blog.id}`}>
              {blog.title} by {blog.author}
            </Link>
          </li>
        ))}
      </ul> */}
    </div>
  )
}

export default BlogList
