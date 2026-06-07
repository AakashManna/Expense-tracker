const request = require('supertest');
const app = require('../src/index');

describe('GET /api/health', () => {
  it('returns status ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});

describe('Expenses API', () => {
  let createdId;

  it('POST /api/expenses — creates a valid expense', async () => {
    const payload = { amount: 500, category: 'Food', date: '2025-01-15', note: 'Test lunch' };
    const res = await request(app).post('/api/expenses').send(payload);
    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    expect(res.body.amount).toBe(500);
    createdId = res.body.id;
  });

  it('POST /api/expenses — rejects negative amount', async () => {
    const res = await request(app)
      .post('/api/expenses')
      .send({ amount: -10, category: 'Food', date: '2025-01-15' });
    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  it('POST /api/expenses — rejects future date', async () => {
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);
    const res = await request(app)
      .post('/api/expenses')
      .send({ amount: 100, category: 'Food', date: futureDate.toISOString().split('T')[0] });
    expect(res.status).toBe(400);
  });

  it('GET /api/expenses — returns an array', async () => {
    const res = await request(app).get('/api/expenses');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('PATCH /api/expenses/:id — updates amount', async () => {
    const res = await request(app).patch(`/api/expenses/${createdId}`).send({ amount: 750 });
    expect(res.status).toBe(200);
    expect(res.body.amount).toBe(750);
  });

  it('DELETE /api/expenses/:id — removes the expense', async () => {
    const res = await request(app).delete(`/api/expenses/${createdId}`);
    expect(res.status).toBe(204);
  });

  it('GET /api/expenses/summary — returns summary shape', async () => {
    const res = await request(app).get('/api/expenses/summary');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('totalThisMonth');
    expect(res.body).toHaveProperty('byCategory');
  });
});

describe('Budgets API', () => {
  it('GET /api/budgets — returns budget object', async () => {
    const res = await request(app).get('/api/budgets');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('Food');
  });

  it('PUT /api/budgets/Food — updates budget', async () => {
    const res = await request(app).put('/api/budgets/Food').send({ limit: 6000 });
    expect(res.status).toBe(200);
    expect(res.body.limit).toBe(6000);
  });
});
