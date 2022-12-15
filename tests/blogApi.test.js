/* eslint-disable jest/expect-expect */
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog');
const User = require('../models/user');
const helper = require('./testHelper');

const api= supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});
  await User.deleteMany({});

  await Blog.insertMany(helper.initialBlogs);
  await api.post('/api/users').send(helper.initialUsers[0]);
});

describe('Viewing all blogs', () => {
  test('all blogs are returned in JSON', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const response = await api.get('/api/blogs');

    expect(response.body).toHaveLength(helper.initialBlogs.length);
  });

  test('id property is "id"', async () => {
    const response = await api.get('/api/blogs');

    expect(response.body[0].id).toBeDefined();
  });
});

describe('adding a blog', () => {
  test('POST request adds blog', async () => {
    const blog = { title: 'test', author: 'John Doe', url: 'dummy.com/lorem', likes: 3 };
    const user = helper.initialUsers[0];

    const userAuth = await api.post('/api/login')
      .set('Content-type', 'application/json')
      .send({ username: user.username, password: user.password });

    const response = await api.post('/api/blogs')
      .set('Content-type', 'application/json')
      .set('Authorization', `bearer ${userAuth.body.token}`)
      .send(blog);

    expect(response.body).toEqual(expect.objectContaining(blog));

    const blogs = await helper.blogsInDB();

    expect(blogs).toHaveLength(helper.initialBlogs.length + 1);
  });

  test('Likes set to 0 if undefined in request body', async () => {
    const blog = { title: 'test', author: 'John Doe', url: 'dummy.com/lorem' };
    const user = helper.initialUsers[0];

    const userAuth = await api.post('/api/login')
      .set('Content-type', 'application/json')
      .send({ username: user.username, password: user.password });

    const response = await api.post('/api/blogs')
      .set('Content-type', 'application/json')
      .set('Authorization', `bearer ${userAuth.body.token}`)
      .send(blog);

    expect(response.body).toEqual(expect.objectContaining({ likes: 0 }));
  });

  test('Error thrown if title, author, and/or url are undefined in request body', async () => {
    const blog = { likes: 1 };
    const user = helper.initialUsers[0];

    const userAuth = await api.post('/api/login')
      .set('Content-type', 'application/json')
      .send({ username: user.username, password: user.password });

    await api.post('/api/blogs')
      .set('Content-type', 'application/json')
      .set('Authorization', `bearer ${userAuth.body.token}`)
      .send(blog)
      .expect(400);

    const response = await helper.blogsInDB();

    expect(response).toHaveLength(helper.initialBlogs.length);
  });

  test('Error thrown if token not provided or invalid', async () => {
    const blog = { title: 'test', author: 'John Doe', url: 'dummy.com/lorem', likes: 0 };

    await api.post('/api/blogs')
      .set('Content-type', 'application/json')
      .send(blog)
      .expect(401);
  });
});

describe('Deleting a blog', () => {
  test('Blog is removed and deletiong returns 204', async () => {
    const blog = { title: 'test', author: 'John Doe', url: 'dummy.com/lorem', likes: 3 };
    const user = helper.initialUsers[0];

    const userAuth = await api.post('/api/login')
      .set('Content-type', 'application/json')
      .send({ username: user.username, password: user.password });

    const sentBlog = await api.post('/api/blogs')
      .set('Content-type', 'application/json')
      .set('Authorization', `bearer ${userAuth.body.token}`)
      .send(blog);

    await api.delete(`/api/blogs/${sentBlog.body.id}`)
      .set('Content-type', 'application/json')
      .set('Authorization', `bearer ${userAuth.body.token}`)
      .expect(204);

    const newBlogs = await helper.blogsInDB();
    expect(newBlogs).toHaveLength(helper.initialBlogs.length);
  });

  test('Returns 404 if blog already deleted', async () => {
    const removedBlogId = await helper.nonExistantBlog();
    const user = helper.initialUsers[0];

    const userAuth = await api.post('/api/login')
      .set('Content-type', 'application/json')
      .send({ username: user.username, password: user.password });

    await api.delete(`/api/blogs/${removedBlogId}`)
      .set('Content-type', 'application/json')
      .set('Authorization', `bearer ${userAuth.body.token}`)
      .expect(404);
  });

  test('Returns 400 if invalid id given', async () => {
    const user = helper.initialUsers[0];

    const userAuth = await api.post('/api/login')
      .set('Content-type', 'application/json')
      .send({ username: user.username, password: user.password });

    await api.delete('/api/blogs/kjhgfdsa')
      .set('Content-type', 'application/json')
      .set('Authorization', `bearer ${userAuth.body.token}`)
      .expect(400);
  });

  test('Error thrown if token not provided or invalid', async () => {
    const initialBlogs = await helper.blogsInDB();

    await api
      .delete(`/api/blogs/${initialBlogs[0].id}`)
      .expect(401);
  });
});

afterAll(() => {
  mongoose.connection.close();
});