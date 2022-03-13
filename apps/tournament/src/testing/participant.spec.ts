import { app } from '../app';
import request from 'supertest';
import { ParticipantInterface, TournamentInterface } from '../app/models/interfaces';
import  connectors from '../connectors';

describe('/tournaments/:id/participants endpoint', () => {
  let exampleTournament, exampleParticipant;

  beforeAll(() => {
    connectors.map(c => c(app));
  })

  beforeEach(() => {

    exampleTournament = {
      name: 'Unreal',
    } as TournamentInterface;

    exampleParticipant = {
      name: 'Player 1',
      elo: 123,
    } as ParticipantInterface;

  });

  afterAll(() => {
    connectors.map(c => c?.disconnect?.());
  })

  describe('[POST] when creating a participants', () => {

    it('should add participant in tournament', async () => {
      const tournament = await request(app).post('/api/tournaments').send(exampleTournament).expect(201);
      const participant = await request(app).post(`/api/tournaments/${tournament.body.id}/participants`).send(exampleParticipant).expect(201);

      const get = await request(app).get(`/api/tournaments/${tournament.body.id}`).expect(200);

      expect(get.body.participants[0]).toBe(participant.body.participant._id);

      await request(app).delete(`/api/tournaments/${get.body.id}`).expect(200);
    });

    it('should not found tournament', async () => {
      await request(app).post('/api/tournaments/123/participants').send(exampleParticipant).expect(404);
    });

    it('participant already exists', async () => {
      const tournament = await request(app).post('/api/tournaments').send(exampleTournament).expect(201);
      await request(app).post(`/api/tournaments/${tournament.body.id}/participants`).send(exampleParticipant).expect(201);
      await request(app).post(`/api/tournaments/${tournament.body.id}/participants`).send(exampleParticipant).expect(400);

      await request(app).delete(`/api/tournaments/${tournament.body.id}`).expect(200);
    });

    it('shouldn\'t have a correct name', async () => {
      exampleParticipant.name = '';

      const tournament = await request(app).post('/api/tournaments').send(exampleTournament).expect(201);
      await request(app).post(`/api/tournaments/${tournament.body.id}/participants`).send(exampleParticipant).expect(400);

      await request(app).delete(`/api/tournaments/${tournament.body.id}`).expect(200);
    });

    it('shouldn\'t have a correct elo', async () => {
      const tournament = await request(app).post('/api/tournaments').send(exampleTournament).expect(201);

      exampleParticipant.elo = null;
      await request(app).post(`/api/tournaments/${tournament.body.id}/participants`).send(exampleParticipant).expect(400);

      exampleParticipant.elo = 1.14;
      await request(app).post(`/api/tournaments/${tournament.body.id}/participants`).send(exampleParticipant).expect(400);

      exampleParticipant.elo = 123;
      await request(app).delete(`/api/tournaments/${tournament.body.id}`).expect(200);
    });
  });

  describe('[GET] tournament participants', () => {

    it('should get all participants of a tournament', async () => {
      const tournament = await request(app).post('/api/tournaments').send(exampleTournament).expect(201);
      await request(app).post(`/api/tournaments/${tournament.body.id}/participants`).send(exampleParticipant).expect(201);
      exampleParticipant.name = 'Player 2';

      await request(app).post(`/api/tournaments/${tournament.body.id}/participants`).send(exampleParticipant).expect(201);

      const get = await request(app).get(`/api/tournaments/${tournament.body.id}/participants`).expect(200);

      expect(get.body.length).toEqual(2);

      await request(app).delete(`/api/tournaments/${tournament.body.id}`).expect(200);
    });

    it('should not found tournament', async () => {
      await request(app).get('/api/tournaments/123/participants').expect(404);
    });
  });

  describe('[DELETE] tournament participants', () => {

    it('delete participant of a tournament', async () => {
      const tournament = await request(app).post('/api/tournaments').send(exampleTournament).expect(201);
      const participant = await request(app).post(`/api/tournaments/${tournament.body.id}/participants`).send(exampleParticipant).expect(201);
      exampleParticipant.name = 'Player 2';

      await request(app).post(`/api/tournaments/${tournament.body.id}/participants`).send(exampleParticipant).expect(201);

      await request(app).delete(`/api/tournaments/${tournament.body.id}/participants/${participant.body.participant.id}`).expect(204);

      const get = await request(app).get(`/api/tournaments/${tournament.body.id}/participants`).expect(200);

      expect(get.body.length).toEqual(1);

      await request(app).delete(`/api/tournaments/${tournament.body.id}`).expect(200);
    });
  });
});
