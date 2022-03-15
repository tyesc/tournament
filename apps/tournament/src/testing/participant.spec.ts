import { v4 as uuidv4 } from 'uuid';

import { app } from '../app';
import request from 'supertest';
import { ParticipantInterface, TournamentInterface } from '../app/models/interfaces';
import { Tournament } from '../app/models';
import  connectors from '../connectors';

describe('/tournaments/:id/participants endpoint', () => {
  let exampleTournament, exampleParticipant, ctx;

  beforeAll(() => {
    connectors.map(c => c(app));
  })

  beforeEach(async () => {
    exampleTournament = {
      id: uuidv4(),
      name: 'Unreal',
    } as TournamentInterface;

    exampleParticipant = {
      name: 'Player 1',
      elo: 123,
    } as ParticipantInterface;

    ctx = {
      tournament: await new Tournament(exampleTournament).save(),
      uuid: uuidv4(),
    };
  });

  afterEach(async () => {
    await ctx.tournament.delete();
  });

  afterAll(() => {
    connectors.map(c => c?.disconnect?.());
  })

  describe('[POST] when creating a participants', () => {

    it('should add participant in tournament', async () => {
      const participant = await request(app).post(`/api/tournaments/${ctx.tournament.id}/participants`).send(exampleParticipant).expect(201);

      const get = await request(app).get(`/api/tournaments/${ctx.tournament.id}`).expect(200);

      expect(get.body.participants[0]).toBe(participant.body.participant._id);
    });

    it('should not found tournament', async () => {
      await request(app).post(`/api/tournaments/${ctx.uuid}/participants`).send(exampleParticipant).expect(404);
    });

    it('participant already exists', async () => {
      await request(app).post(`/api/tournaments/${ctx.tournament.id}/participants`).send(exampleParticipant).expect(201);
      await request(app).post(`/api/tournaments/${ctx.tournament.id}/participants`).send(exampleParticipant).expect(400);
    });

    it('shouldn\'t have a correct name', async () => {
      exampleParticipant.name = '';
      await request(app).post(`/api/tournaments/${ctx.tournament.id}/participants`).send(exampleParticipant).expect(400);
    });

    it('shouldn\'t have a correct elo', async () => {
      exampleParticipant.elo = null;
      await request(app).post(`/api/tournaments/${ctx.tournament.id}/participants`).send(exampleParticipant).expect(400);

      exampleParticipant.elo = 1.14;
      await request(app).post(`/api/tournaments/${ctx.tournament.id}/participants`).send(exampleParticipant).expect(400);
    });

    it('should not have validate id', async () => {
      await request(app).post('/api/tournaments/123/participants').send(exampleParticipant).expect(400);
    });
  });

  describe('[GET] tournament participants', () => {

    it('should get all participants of a tournament', async () => {
      await request(app).post(`/api/tournaments/${ctx.tournament.id}/participants`).send(exampleParticipant).expect(201);
      exampleParticipant.name = 'Player 2';

      await request(app).post(`/api/tournaments/${ctx.tournament.id}/participants`).send(exampleParticipant).expect(201);

      const get = await request(app).get(`/api/tournaments/${ctx.tournament.id}/participants`).expect(200);

      expect(get.body.length).toEqual(2);
    });

    it('should not found tournament', async () => {
      await request(app).get(`/api/tournaments/${ctx.uuid}/participants`).expect(404);
    });

    it('should not have validate id', async () => {
      await request(app).get('/api/tournaments/123/participants').expect(400);
    });
  });

  describe('[DELETE] tournament participants', () => {

    it('delete participant of a tournament', async () => {
      const participant = await request(app).post(`/api/tournaments/${ctx.tournament.id}/participants`).send(exampleParticipant).expect(201);
      exampleParticipant.name = 'Player 2';

      await request(app).post(`/api/tournaments/${ctx.tournament.id}/participants`).send(exampleParticipant).expect(201);

      await request(app).delete(`/api/tournaments/${ctx.tournament.id}/participants/${participant.body.participant.id}`).expect(204);

      const get = await request(app).get(`/api/tournaments/${ctx.tournament.id}/participants`).expect(200);

      expect(get.body.length).toEqual(1);
    });

    it('should not found tournament', async () => {
      const participant = await request(app).post(`/api/tournaments/${ctx.tournament.id}/participants`).send(exampleParticipant).expect(201);
      exampleParticipant.name = 'Player 2';

      await request(app).post(`/api/tournaments/${ctx.tournament.id}/participants`).send(exampleParticipant).expect(201);
      await request(app).delete(`/api/tournaments/${ctx.uuid}/participants/${participant.body.participant.id}`).expect(404);

      await request(app).delete(`/api/tournaments/${ctx.tournament.id}/participants/${participant.body.participant.id}`).expect(204);
    });

    it('should not have validate id', async () => {
      const participant = await request(app).post(`/api/tournaments/${ctx.tournament.id}/participants`).send(exampleParticipant).expect(201);
      await request(app).delete(`/api/tournaments/123/participants/${participant.body.participant.id}`).expect(400);

      await request(app).delete(`/api/tournaments/${ctx.tournament.id}/participants/${participant.body.participant.id}`).expect(204);
    });
  });
});
