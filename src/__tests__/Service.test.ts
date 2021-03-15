import request from 'supertest';
import { getConnection } from 'typeorm';
import { app } from '../app';
import createConnection from '../database';

describe('Service', () => {
  beforeAll(async () => {
    const conncetion = createConnection();
    await (await conncetion).runMigrations();
  });

  afterAll(async () => {
    const connection = getConnection();
    await connection.dropDatabase();
    await connection.close();
  });

  it('Should be able to create a new service', async () => {
    const response = await request(app).post('/service').send({
      title: 'title example',
      description: 'description example',
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
  });

  it('Should be able to get all service', async () => {
    await request(app).post('/service').send({
      title: 'title example2',
      description: 'description example2',
    });

    const response = await request(app).get('/service');

    expect(response.body.length).toBe(2);
  });
});
