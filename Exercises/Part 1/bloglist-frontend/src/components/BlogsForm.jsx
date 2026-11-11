const BlogsForm = ({ handleBlogCreate }) => {
  return (
    <form onSubmit={handleBlogCreate}>
      <div>
        <h3>create new</h3>
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
      <button type="submit">Create a blog</button>
    </form>
  )
}

export default BlogsForm
