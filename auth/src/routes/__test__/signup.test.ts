import request from 'supertest';
import { app } from '../../app';

it('returns a 201 on successful signup', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);
});

it('returns a 400 with an invalid email', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'asdf',
      password: 'password',
    })
    .expect(400);
});

it('returns a 400 with an invalid password', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'asdf@asdf.com',
      password: 'p',
    })
    .expect(400);
});

it('returns a 400 with missing email and password', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({ email: 'a@a.com' })
    .expect(400);

  await request(app)
    .post('/api/users/signup')
    .send({ password: 'asdfasdf' })
    .expect(400);
});

it('disallows duplicate emails', async () => {
  const user = { email: 't@t.com', password: 'password' };
  await request(app).post('/api/users/signup').send(user).expect(201);

  await request(app).post('/api/users/signup').send(user).expect(400);
});

it('sets a cookie after successful signup', async () => {
  const response = await request(app)
    .post('/api/users/signup')
    .send({ email: 't@t.com', password: 'password' })
    .expect(201);

  expect(response.get('Set-Cookie')).toBeDefined();
});
