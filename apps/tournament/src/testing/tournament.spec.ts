import { app } from '../app';
import * as request from 'supertest';
import { Participant, Tournament } from '../app/api/api-model';

const exampleTournament = {
  name: 'Unreal',
} as Tournament;

const exampleUnamedTournament = {
  name: '',
} as Tournament;

const exampleParticipant = {
  name: 'Player 1',
  elo: 123,
} as Participant;

const exampleEmptyNameParticipant = {
  name: '',
  elo: 123,
} as Participant;

const exampleEmptyEloParticipant = {
  name: 'Player 1',
  elo: null,
} as Participant;

describe('/tournament endpoint', () => {
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

    it('le champ nom est manquant ou vide', async () => {
      await request(app).post('/api/tournaments').send(exampleUnamedTournament).expect(400);
    });

    it('le nom est déjà pris', async () => {
      const { body } = await request(app).post('/api/tournaments').send(exampleTournament).expect(201);
      await request(app).post('/api/tournaments').send(exampleTournament).expect(400);

      await request(app).delete(`/api/tournaments/${body.id}`).expect(200);
    });

    it('le tournoi n\'existe pas', async () => {
      await request(app).get('/api/tournaments/123').expect(404);
    });
  });

  describe('[POST] when creating a participants', () => {

    it('le participant a été ajouté au tournois', async () => {
      const tournament = await request(app).post('/api/tournaments').send(exampleTournament).expect(201);
      const participant = await request(app).post(`/api/tournaments/${tournament.body.id}/participants`).send(exampleParticipant).expect(201);

      const get = await request(app).get(`/api/tournaments/${tournament.body.id}`).expect(200);

      expect(get.body.participants[0].id).toBe(participant.body.id);

      await request(app).delete(`/api/tournaments/${get.body.id}`).expect(200);
    });

    it('le tournoi n\'existe pas', async () => {
      await request(app).post('/api/tournaments/123/participants').send(exampleParticipant).expect(404);
    });

    it('le participant existe déjà', async () => {
      const tournament = await request(app).post('/api/tournaments').send(exampleTournament).expect(201);
      await request(app).post(`/api/tournaments/${tournament.body.id}/participants`).send(exampleParticipant).expect(201);
      await request(app).post(`/api/tournaments/${tournament.body.id}/participants`).send(exampleParticipant).expect(400);

      await request(app).delete(`/api/tournaments/${tournament.body.id}`).expect(200);
    });

    it('le nom (chaine de caractères vide) est incorrect', async () => {
      const tournament = await request(app).post('/api/tournaments').send(exampleTournament).expect(201);
      await request(app).post(`/api/tournaments/${tournament.body.id}/participants`).send(exampleEmptyNameParticipant).expect(400);

      await request(app).delete(`/api/tournaments/${tournament.body.id}`).expect(200);
    });

    it('l\'elo (nombre entier) est incorrect', async () => {
      const tournament = await request(app).post('/api/tournaments').send(exampleTournament).expect(201);
      await request(app).post(`/api/tournaments/${tournament.body.id}/participants`).send(exampleEmptyEloParticipant).expect(400);

      await request(app).delete(`/api/tournaments/${tournament.body.id}`).expect(200);
    });
  });

  describe('[GET] tournament participants', () => {

    it('liste des participants au tournois', async () => {
      const tournament = await request(app).post('/api/tournaments').send(exampleTournament).expect(201);
      await request(app).post(`/api/tournaments/${tournament.body.id}/participants`).send(exampleParticipant).expect(201);
      exampleParticipant.name = 'Palyer 2';

      await request(app).post(`/api/tournaments/${tournament.body.id}/participants`).send(exampleParticipant).expect(201);

      const get = await request(app).get(`/api/tournaments/${tournament.body.id}/participants`).expect(200);

      expect(get.body.length).toEqual(2);

      await request(app).delete(`/api/tournaments/${tournament.body.id}`).expect(200);
      exampleParticipant.name = 'Palyer 1';
    });

    it('le tournoi n\'existe pas', async () => {
      await request(app).get('/api/tournaments/123/participants').expect(404);
    });
  });

  describe('[DELETE] tournament participants', () => {

    it('delete participant of a tourntament', async () => {
      const tournament = await request(app).post('/api/tournaments').send(exampleTournament).expect(201);
      const participant = await request(app).post(`/api/tournaments/${tournament.body.id}/participants`).send(exampleParticipant).expect(201);
      exampleParticipant.name = 'Palyer 2';

      await request(app).post(`/api/tournaments/${tournament.body.id}/participants`).send(exampleParticipant).expect(201);

      await request(app).delete(`/api/tournaments/${tournament.body.id}/participants/${participant.body.id}`).expect(204);

      const get = await request(app).get(`/api/tournaments/${tournament.body.id}/participants`).expect(200);

      expect(get.body.length).toEqual(1);

      await request(app).delete(`/api/tournaments/${tournament.body.id}`).expect(200);
    });
  });
});
