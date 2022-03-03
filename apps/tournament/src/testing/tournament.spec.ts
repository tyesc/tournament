import { app } from '../app';
import * as request from 'supertest';
import { Tournament, TournamentPhaseType } from '../app/api/api-model';
import { TournamentRepository } from '../app/repository/tournament-repository';

const exampleTournament = {
  name: 'Unreal',
} as Tournament;

const exampleUnamedTournament = {
  name: '',
} as Tournament;



describe('/tournament endpoint', () => {
  describe('[POST] when creating a tournament', () => {
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
      await request(app).post('/api/tournaments').send(exampleTournament).expect(201);
      await request(app).post('/api/tournaments').send(exampleTournament).expect(400);
    });
  });
});
