import { useState, forwardRef } from 'react';
import PropTypes from 'prop-types';
import Toggle from './Toggle';

const BlogForm = forwardRef(({ createBlog }, ref) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  const addBlog = (event) => {
    event.preventDefault();
    createBlog({ title, author, url });


    setAuthor('');
    setTitle('');
    setUrl('');
  };

  return(
    <Toggle ref={ref}>
      <form onSubmit={addBlog}>
        <label htmlFor="title">Title: </label>
        <input type="text" id='title' value={title} onChange={(event) => setTitle(event.target.value)} />
        <label htmlFor="author">Author: </label>
        <input type="text" id='author'value={author} onChange={(event) => setAuthor(event.target.value)} />
        <label htmlFor="url">URL: </label>
        <input type="text" id='url' value={url} onChange={(event) => setUrl(event.target.value)} />
        <button type="submit" id="add">Add</button>
      </form>
    </Toggle>
  );
});

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired
};

BlogForm.displayName = 'BlogForm';

export default BlogForm;