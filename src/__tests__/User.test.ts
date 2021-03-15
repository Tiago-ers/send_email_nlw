import request from 'supertest';
import { getConnection } from 'typeorm';
import { app } from '../app';
import createConnection from '../database';

describe('Users', () => {
  beforeAll(async () => {
    const conncetion = createConnection();
    await (await conncetion).runMigrations();
  });

  afterAll(async () => {
    const connection = getConnection();
    await connection.dropDatabase();
    await connection.close();
  });

  it('Should be able to create a new user', async () => {
    const response = await request(app).post('/users').send({
      email: 'users@teste.com',
      name: 'user teste',
    });

    expect(response.status).toBe(201);
  });

  it('Should not be able to create a new user with exists email', async () => {
    const response = await request(app).post('/users').send({
      email: 'users@teste.com',
      name: 'user teste',
    });
    expect(response.status).toBe(400);
  });
});
