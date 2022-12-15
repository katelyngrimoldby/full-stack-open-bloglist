import { useState } from 'react';
import PropTypes from 'prop-types';

const Blog = ({ blog, updateBlog, deleteBlog, user }) => {
  const [visible, setVisible] = useState(false);

  const handleToggle = () => {
    setVisible(!visible);
  };

  const handleUpdate = () => {
    updateBlog(blog.id, {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
      user: blog.user.id
    });
  };

  const handleDelete = () => {
    if(window.confirm(`Remove ${blog.title} by ${blog.author}?`)) {
      deleteBlog(blog.id);
    }
  };

  return(
    <div className="blog">
      <p>
        {blog.title} {blog.author}{' '}
        <button className="toggleButton" onClick={handleToggle}>{visible ? 'hide' : 'show'}</button>
      </p>
      {visible && (
        <div className="toggleable">
          <p>{blog.url}</p>
          <p>Likes: {blog.likes} <button onClick={handleUpdate} className="likeButton">Like</button></p>
          <p>Added by: {blog.user.name}</p>
          {user.username === blog.user.username && (<button onClick={handleDelete} className="deleteButton">Remove</button>)}
        </div>
      )}
    </div>
  );
};

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  updateBlog: PropTypes.func.isRequired,
  deleteBlog: PropTypes.func.isRequired
};

export default Blog;
