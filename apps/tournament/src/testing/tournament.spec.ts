import { app } from '../app';
import * as request from 'supertest';
import { Participant, Tournament, TournamentPhase } from '../app/api/api-model';

const exampleTournament = {
  name: 'Unreal',
} as Tournament;

const exampleParticipant = {
  name: 'Player 1',
  elo: 123,
} as Participant;

const exampleTournamentPhase = {
  type: 'SingleBracketElimination',
} as TournamentPhase;


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
      exampleTournament.name = '';

      await request(app).post('/api/tournaments').send(exampleTournament).expect(400);

      exampleTournament.name = 'Unreal';
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

  describe('[POST] creating a participants', () => {

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
      exampleParticipant.name = '';

      const tournament = await request(app).post('/api/tournaments').send(exampleTournament).expect(201);
      await request(app).post(`/api/tournaments/${tournament.body.id}/participants`).send(exampleParticipant).expect(400);

      await request(app).delete(`/api/tournaments/${tournament.body.id}`).expect(200);

      exampleParticipant.name = 'Player 1';
    });

    it('l\'elo (nombre entier) est incorrect', async () => {
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

    it('liste des participants au tournois', async () => {
      const tournament = await request(app).post('/api/tournaments').send(exampleTournament).expect(201);
      await request(app).post(`/api/tournaments/${tournament.body.id}/participants`).send(exampleParticipant).expect(201);
      exampleParticipant.name = 'Player 2';

      await request(app).post(`/api/tournaments/${tournament.body.id}/participants`).send(exampleParticipant).expect(201);

      const get = await request(app).get(`/api/tournaments/${tournament.body.id}/participants`).expect(200);

      expect(get.body.length).toEqual(2);

      await request(app).delete(`/api/tournaments/${tournament.body.id}`).expect(200);
      exampleParticipant.name = 'Player 1';
    });

    it('le tournoi n\'existe pas', async () => {
      await request(app).get('/api/tournaments/123/participants').expect(404);
    });
  });

  describe('[DELETE] tournament participants', () => {

    it('delete participant of a tournament', async () => {
      const tournament = await request(app).post('/api/tournaments').send(exampleTournament).expect(201);
      const participant = await request(app).post(`/api/tournaments/${tournament.body.id}/participants`).send(exampleParticipant).expect(201);
      exampleParticipant.name = 'Player 2';

      await request(app).post(`/api/tournaments/${tournament.body.id}/participants`).send(exampleParticipant).expect(201);

      await request(app).delete(`/api/tournaments/${tournament.body.id}/participants/${participant.body.id}`).expect(204);

      const get = await request(app).get(`/api/tournaments/${tournament.body.id}/participants`).expect(200);

      expect(get.body.length).toEqual(1);

      await request(app).delete(`/api/tournaments/${tournament.body.id}`).expect(200);
    });
  });

  describe('[POST] tournament phases', () => {

    it('la phase a été ajouté au tournois', async () => {
      const tournament = await request(app).post('/api/tournaments').send(exampleTournament).expect(201);
      const phase = await request(app).post(`/api/tournaments/${tournament.body.id}/phases`).send(exampleTournamentPhase).expect(201);

      const get = await request(app).get(`/api/tournaments/${tournament.body.id}`).expect(200);

      expect(get.body.phases[0].id).toBe(phase.body.id);

      await request(app).delete(`/api/tournaments/${get.body.id}`).expect(200);
    });

    it('le tournoi n\'existe pas', async () => {
      await request(app).post('/api/tournaments/123/phases').send(exampleTournamentPhase).expect(404);
    });

    it('le type n\'est pas fourni ou n\'est pas connu', async () => {
      const tournament = await request(app).post('/api/tournaments').send(exampleTournament).expect(201);
      await request(app).post(`/api/tournaments/${tournament.body.id}/phases`).send(exampleTournamentPhase).expect(201);
      await request(app).post(`/api/tournaments/${tournament.body.id}/phases`).send(exampleTournamentPhase).expect(400);

      exampleTournamentPhase.type = null;
      await request(app).post(`/api/tournaments/${tournament.body.id}/phases`).send(exampleTournamentPhase).expect(400);

      await request(app).delete(`/api/tournaments/${tournament.body.id}`).expect(200);
      exampleTournamentPhase.type = 'SingleBracketElimination';
    });
  });

  describe('[GET] tournament phases', () => {

    it('liste des phases au tournois', async () => {
      const tournament = await request(app).post('/api/tournaments').send(exampleTournament).expect(201);

      exampleTournamentPhase.type = 'SwissRound';
      await request(app).post(`/api/tournaments/${tournament.body.id}/phases`).send(exampleParticipant).expect(201);S
      await request(app).post(`/api/tournaments/${tournament.body.id}/phases`).send(exampleParticipant).expect(201);

      const get = await request(app).get(`/api/tournaments/${tournament.body.id}/phases`).expect(200);

      expect(get.body.length).toEqual(2);

      await request(app).delete(`/api/tournaments/${tournament.body.id}`).expect(200);
    });

    it('le tournoi n\'existe pas', async () => {
      await request(app).get('/api/tournaments/123/participants').expect(404);
    });
  });
});
