import request from 'supertest';
import { app } from '../../app';

const user = { email: 'a@a.com', password: 'password' };

it('fails when a email that does not exist is supplied', async () => {
  await request(app).post('/api/users/signin').send(user).expect(400);
});

it('fails when an incorrect password is supplied', async () => {
  const user = { email: 'a@a.com', password: 'password' };
  await request(app).post('/api/users/signup').send(user).expect(201);

  await request(app)
    .post('/api/users/signin')
    .send({ ...user, password: 'wordpass' })
    .expect(400);
});

it('responds with a cookie when given valid credentials', async () => {
  await request(app).post('/api/users/signup').send(user).expect(201);

  const response = await request(app)
    .post('/api/users/signin')
    .send(user)
    .expect(200);

  expect(response.get('Set-Cookie')).toBeDefined();
});
