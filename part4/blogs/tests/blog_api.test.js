const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');

const api = supertest(app);
const Blog = require('../models/blog');

const {
  initialBlogs,
  blogsInDb,
  nonExistingId,
  usersInDb,
} = require('./test_helper');

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(initialBlogs);
}, 60000);

describe('When there are some inital blogs saved', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  }, 60000);

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs');

    expect(response.body).toHaveLength(initialBlogs.length);
  }, 60000);

  test('a specific blog is within the returned blogs', async () => {
    const response = await api.get('/api/blogs');

    const titles = response.body.map((blog) => blog.title);
    expect(titles).toContain('HTML is Easy');
  }, 60000);
});

describe('viewing a specific blog', () => {
  test('a specific blog can be viewed', async () => {
    const blogsAtStart = await blogsInDb();

    const blogToView = blogsAtStart[0];

    const result = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(result.body).toEqual(blogToView);
  });

  test('fails with status code 404 if blog does not exist', async () => {
    const validNonexistingId = await nonExistingId();

    await api.get(`/api/blogs/${validNonexistingId}`).expect(404);
  });

  test('fails with status code 400 if id is invalid', async () => {
    const invalidId = '5a3d5da59070081a82a3445';

    await api.get(`/api/blogs/${invalidId}`).expect(400);
  });
});

describe('Addition of a new blog', () => {
  test("a valid blog can be added, and the blog's 'user' field is assigned the logged-in user's id", async () => {
    const usersAtStart = await usersInDb();
    const { username, id } = usersAtStart[0];

    const {
      body: { token },
    } = await api
      .post('/api/login')
      .send({ username, password: 'sekret' })
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const newBlog = {
      title: 'How to use async/await',
      author: 'Polina Parfenova',
      url: 'https://www.craveweb.dev',
      likes: 42,
    };
    const { body: returnedBlog } = await api
      .post('/api/blogs')
      .send(newBlog)
      .set({ Authorization: `Bearer ${token}` })
      .expect(201)
      .expect('Content-Type', /application\/json/);
    expect(returnedBlog.user).toBe(id);

    const blogsAtEnd = await blogsInDb();
    expect(blogsAtEnd).toHaveLength(initialBlogs.length + 1);

    const titles = blogsAtEnd.map((blog) => blog.title);
    expect(titles).toContain('How to use async/await');
  }, 60000);

  test('if there is no user authentication, the API responds with 400', async () => {
    const token = 'abc';
    const newBlog = {
      title: 'No Auth: A Memoir',
      author: 'Brendon Crave',
      url: 'https://www.craveweb.dev',
      likes: 24,
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set({ Authorization: token })
      .expect(400);
  }, 60000);

  test('a blog without a title or url is not added and API responds with 400', async () => {
    const blogsAtStart = await blogsInDb();

    const newBlog = {
      likes: 21,
    };

    await api.post('/api/blogs').send(newBlog).expect(400);

    const blogsAtEnd = await blogsInDb();
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length);
  }, 60000);

  test("the unique identifier for an individual blog is named 'id'", async () => {
    const blogsAtStart = await blogsInDb();
    const blogToView = blogsAtStart[0];

    const result = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(result.body.id).toBeDefined();
  }, 60000);

  test("if the 'likes' property is missing from the request, it will default to 0", async () => {
    const usersAtStart = await usersInDb();
    const { username } = usersAtStart[0];
    const {
      body: { token },
    } = await api
      .post('/api/login')
      .send({ username, password: 'sekret' })
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const newBlog = {
      title: 'I love cats! And code!',
      author: 'Polina Parfenova',
      url: 'https://github.com/',
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .set({ Authorization: `Bearer ${token}` })
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await blogsInDb();
    const [blogToCheckLikes] = blogsAtEnd.filter(
      (blog) => blog.title === 'I love cats! And code!'
    );

    const result = await api.get(`/api/blogs/${blogToCheckLikes.id}`);
    expect(result.body.likes).toBe(0);
  }, 60000);
});

describe('Updating a blog', () => {
  test("a blog's likes can be updated", async () => {
    const blogsAtStart = await blogsInDb();
    const blogToUpdate = blogsAtStart[0];

    blogToUpdate.likes++;

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(blogToUpdate)
      .expect(202)
      .expect('Content-Type', /application\/json/);

    const result = await api.get(`/api/blogs/${blogToUpdate.id}`);
    expect(result.status).toBe(200);
    expect(result.body).toEqual(blogToUpdate);
  });
});

describe('Deletion of a blog', () => {
  test('a blog can be deleted by the user that created it', async () => {
    const usersAtStart = await usersInDb();
    const blogsAtStart = await blogsInDb();
    const user = usersAtStart[0];

    const {
      body: { token },
    } = await api
      .post('/api/login')
      .send({ username: user.username, password: 'sekret' })
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const newBlog = {
      title: 'Delete me please',
      author: 'Brendon Crave',
      url: 'http://localhost:3000',
    };

    const { body: blogToDelete } = await api
      .post('/api/blogs')
      .send(newBlog)
      .set({ Authorization: `Bearer ${token}` });

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set({ Authorization: `Bearer ${token}` })
      .expect(204);

    const blogsAtEnd = await blogsInDb();
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length);

    const titles = blogsAtEnd.map((blog) => blog.title);
    expect(titles).not.toContain(blogToDelete.title);
  }, 60000);
});

afterAll(async () => {
  await mongoose.connection.close();
});
