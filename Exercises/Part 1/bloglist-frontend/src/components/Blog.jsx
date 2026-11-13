import { useState } from "react"
import {
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Link as MuiLink,
} from "@mui/material"

const Blog = ({ loggedUser, blog, updateBlog, deleteBlog }) => {
  const [showAll, setShowALl] = useState(false)

  if (!blog) {
    return null
  }

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
      <CardContent sx={{ mt: 2 }}>
        <Typography gutterBottom>{title}</Typography>

        <Typography gutterBottom>by {author}</Typography>

        <MuiLink
          href={url}
          target="_blank"
          rel="noopener"
          display="block"
          gutterBottom
        >
          {url}
        </MuiLink>

        <Typography gutterBottom>Added by {user?.name}</Typography>

        <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 2 }}>
          <Typography>{likes} likes</Typography>
          <Button variant="outlined" onClick={handleLike}>
            like
          </Button>
          <Button variant="outlined" color="error" onClick={handleDelete}>
            remove
          </Button>
        </Stack>
      </CardContent>
    )
  }

  return (
    <CardContent sx={{ mt: 2 }}>
      <Typography gutterBottom>{title}</Typography>

      <Typography gutterBottom>by {author}</Typography>

      <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 2 }}>
        <Button variant="outlined" onClick={() => setShowALl(!showAll)}>
          View Detail
        </Button>
      </Stack>
    </CardContent>
  )

  /* <div style={blogStyle}>
        {title} {author}
        <button onClick={() => setShowALl(!showAll)}>View detail</button>
      </div> */
}

export default Blog
