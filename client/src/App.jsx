import { useState, useEffect, useRef } from 'react';
import Blog from './components/Blog';
import blogService from './services/blogs';
import login from './services/login';
import BlogForm from './components/BlogForm';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const blogFormRef = useRef(null);

  useEffect(() => {
    const userJSON = window.localStorage.getItem('User');

    if(userJSON) {
      const userData = JSON.parse(userJSON);
      setUser(userData);
    }

    blogService.getAll().then(blogs => {
      setBlogs(blogs.sort((bloga, blogb) => blogb.likes - bloga.likes));
    });
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const userData = await login({ username, password });
      setUser(userData);

      window.localStorage.setItem('User', JSON.stringify(userData));
    } catch(error) {
      setMessage('Invalid username or password');
      setTimeout(() => setMessage(''), 5000);
    }

    setUsername('');
    setPassword('');
  };

  const handleLogout = () => {
    window.localStorage.removeItem('User');
    setUser(undefined);
  };

  const handleUpdate = async (id, blogObject) => {
    try {
      const updatedBlog = await blogService.update(id, blogObject);

      const newBlogs = [...blogs].map(blog => blog.id === updatedBlog.id ? updatedBlog : blog);

      setBlogs(newBlogs.sort((bloga, blogb) => blogb.likes - bloga.likes));
      setMessage(`Liked ${blogObject.title} by ${blogObject.author}`);
      setTimeout(() => setMessage(''), 5000);
    } catch(error) {
      setMessage(error.message);
      setTimeout(() => setMessage(''), 5000);
    }
  };

  const handleCreation = async (blogObject) => {
    try {
      const newBlog = await blogService.addNew(blogObject, user.token);

      setBlogs(blogs.concat(newBlog));

      setMessage(`Added ${blogObject.title} by ${blogObject.author}`);
      setTimeout(() => setMessage(''), 5000);
    } catch(error) {
      setMessage(error.message);
      setTimeout(() => setMessage(''), 5000);
    }

    blogFormRef.current.handleClick();
  };

  const handleDelete = async (id) => {
    try {
      const blog = blogs.find(blog => blog.id === id);
      await blogService.deleteBlog(id, user.token);
      setBlogs([...blogs].filter(blog => blog.id !== id));
      setMessage(`Removed ${blog.title} by ${blog.author}`);
      setTimeout(() => setMessage(''), 5000);
    } catch(error) {
      setMessage(error.message);
      setTimeout(() => setMessage(''), 5000);
    }
  };

  return (
    <>
      {message && (<p>{message}</p>)}
      {!user ? (
        <div>
          <h2>Log In</h2>
          <form onSubmit={handleLogin}>
            <label htmlFor="username">Username</label>
            <input
              type='text'
              id='username'
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
            <label htmlFor="password">Password</label>
            <input
              type='password'
              id='password'
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <button type='submit' id="login">Log In</button>
          </form>
        </div>) : (
        <div>
          <p>Logged in as {user.name}</p>
          <button onClick={handleLogout}>Log Out</button>
          <h2>blogs</h2>
          {blogs.map(blog =>
            <Blog
              key={blog.id}
              blog={blog}
              user={user}
              updateBlog={handleUpdate}
              deleteBlog={handleDelete}
            />
          )}
          <h2>Create New</h2>
          <BlogForm createBlog={handleCreation} ref={blogFormRef} />
        </div>
      )}
    </>
  );
};

export default App;
