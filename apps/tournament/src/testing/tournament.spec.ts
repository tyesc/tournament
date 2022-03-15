import { v4 as uuidv4 } from 'uuid';

import { app } from '../app';
import request from 'supertest';
import { TournamentInterface } from '../app/models/interfaces';
import  connectors from '../connectors';

describe('/tournament endpoint', () => {
  let exampleTournament, ctx;

  beforeAll(() => {
    connectors.map(c => c(app));
  })

  beforeEach(() => {
    exampleTournament = {
      name: 'Unreal',
    } as TournamentInterface;

    ctx = {
      uuid: uuidv4(),
    };
  });

  afterAll(() => {
    connectors.map(c => c?.disconnect?.());
  })

  describe('[POST] && [GET] tournament', () => {
    it('should return the correct id', async () => {
      const { body } = await request(app).post('/api/tournaments').send(exampleTournament).expect(201);

      expect(body.id).not.toBeUndefined();
      await request(app).delete(`/api/tournaments/${body.id}`).expect(200);
    });

    it('should have stored the tournament', async () => {
      const { body } = await request(app).post('/api/tournaments').send(exampleTournament).expect(201);

      const get = await request(app).get(`/api/tournaments/${body.id}`).expect(200);

      expect(get.body.name).toEqual(exampleTournament.name);
      await request(app).delete(`/api/tournaments/${body.id}`).expect(200);
    });

    it('shouldn\'t have a correct name', async () => {
      exampleTournament.name = '';

      await request(app).post('/api/tournaments').send(exampleTournament).expect(400);
    });

    it('tournament with same name exists', async () => {
      const { body } = await request(app).post('/api/tournaments').send(exampleTournament).expect(201);
      await request(app).post('/api/tournaments').send(exampleTournament).expect(400);

      await request(app).delete(`/api/tournaments/${body.id}`).expect(200);
    });

    it('should not have validate id', async () => {
      await request(app).get('/api/tournaments/123').expect(400);
    });

    it('should not found tournament', async () => {
      await request(app).get(`/api/tournaments/${ctx.uuid}`).expect(404);
    });
  });

  describe('[DELETE] tournament', () => {
    it('should remove tournament', async () => {
      const { body } = await request(app).post('/api/tournaments').send(exampleTournament).expect(201);

      await request(app).delete(`/api/tournaments/${body.id}`).expect(200);
    });

    it('should not found tournament', async () => {
      await request(app).delete(`/api/tournaments/${ctx.uuid}`).expect(404);
    });

    it('should not have validate id', async () => {
      await request(app).delete('/api/tournaments/123').expect(400);
    });
  });
});
