  // import { describe, it, expect, vi, beforeEach } from 'vitest';
  // import { calculerSuiviHebdo } from '../../services/suiviHebdoService';
  // import * as SuiviHebDoService from '../../services/suiviHebdoService'; // adapte le chemin selon ton arbo
  // import * as JournalAlimentaireService from '../../services/journalAlimentaireService';
  // import { LigneJournalAlimentaireRow } from '../../types/ligneJournalalimentaire.js';
  // import { UNITE_BASE } from '../../config';
  // import {lignesLundi,lignesMardi,lignesMercredi,lignesJeudi,lignesVendredi,lignesSamedi,lignesDimanche} from '../dataTests/journalAlimentaireDataTest'


  // // On mock le service
  // vi.mock('../../services/journalAlimentaireService', () => ({
  //   // 👇 exporte directement les fonctions du module
  //   liste: vi.fn(),
  // }));

  // const BONUS_HEBDOMMADAIRE = 35 ;
  // const POINTS_JOURNALIER = 25;

  // describe('calculerSuiviHebdo', () => {
  //   beforeEach(() => {
  //     vi.clearAllMocks();
  //   });

  //   it('TEST 1 - devrait calculer le suivi avec un seul jour consommé', async () => {
  //     const dateDebut = new Date('2025-07-21'); // un lundi
  //     const lignes: LigneJournalAlimentaireRow[] = [
  //       {
  //         id: 1,uti_id:1, date: '2025-07-21', type_repas_id: 1, aliment_id: 1, quantite: 1, nombre_point: 27, unite: UNITE_BASE
  //       } // dépassement de 2 points
  //     ];

  //     vi.mocked(JournalAlimentaireService.liste).mockResolvedValue(lignes);

  //     const retour = await calculerSuiviHebdo(1, dateDebut);
  //     const result = retour.resultats

  //     expect(result.semaine).toBe('2025-07-21');
  //     expect(result.bonusInitial).toBe(BONUS_HEBDOMMADAIRE);
  //     expect(result.bonusRestant).toBe(BONUS_HEBDOMMADAIRE - 2);

  //     expect(result.recap.length).toBe(7);
  //     expect(result.recap[0]).toEqual({
  //       date: '2025-07-21',
  //       pointsAutorises: POINTS_JOURNALIER,
  //       pointsConsommes: 27,
  //       bonusUtilise: 2,
  //       bonusRestant: BONUS_HEBDOMMADAIRE - 2,
  //     });

  //     for (let i = 1; i < 7; i++) {
  //       expect(result.recap[i].pointsConsommes).toBe(0);
  //     }
  //   });

  //   it('TEST 2 - devrait calculer le suivi avec plusieurs lignes le lundi sans entamer le bonus', async () => {
  //     const dateDebut = new Date('2025-07-21'); // un lundi

  //     const lignes: LigneJournalAlimentaireRow[] = [
  //       ...lignesLundi(), // 20 poins
  //     ];

  //     vi.mocked(JournalAlimentaireService.liste).mockResolvedValue(lignes);

  //     const retour = await calculerSuiviHebdo(1, dateDebut);
  //     const result = retour.resultats


  //     expect(result.semaine).toBe('2025-07-21');
  //     expect(result.bonusInitial).toBe(BONUS_HEBDOMMADAIRE);
  //     expect(result.bonusRestant).toBe(BONUS_HEBDOMMADAIRE); // aucun bonus utilisé

  //     expect(result.recap.length).toBe(7);
  //     expect(result.recap[0]).toEqual({
  //       date: '2025-07-21',
  //       pointsAutorises: POINTS_JOURNALIER,
  //       pointsConsommes: 20,
  //       bonusUtilise: 0,
  //       bonusRestant: BONUS_HEBDOMMADAIRE,
  //     });

  //     for (let i = 1; i < 7; i++) {
  //       expect(result.recap[i].pointsConsommes).toBe(0);
  //     }
  //   });
      
  //   it('TEST 3 - devrait calculer le suivi avec plusieurs lignes le lundi et mardi : bonus entamé de 2 points', async () => {
  //     const dateDebut = new Date('2025-07-21'); // un lundi

  //     const lignes: LigneJournalAlimentaireRow[] = [
  //       ...lignesLundi(), // 20 points
  //       ...lignesMardi(), // 27 points
  //     ];

  //     vi.mocked(JournalAlimentaireService.liste).mockResolvedValue(lignes);

  //     const retour = await calculerSuiviHebdo(1, dateDebut);
  //     const result = retour.resultats


  //     expect(result.semaine).toBe('2025-07-21');
  //     expect(result.bonusInitial).toBe(BONUS_HEBDOMMADAIRE);
  //     expect(result.bonusRestant).toBe(BONUS_HEBDOMMADAIRE - 2); // 2 pts de bonus

  //     expect(result.recap.length).toBe(7);
  //     expect(result.recap[0]).toEqual({
  //       date: '2025-07-21',
  //       pointsAutorises: POINTS_JOURNALIER,
  //       pointsConsommes: 20,
  //       bonusUtilise: 0,
  //       bonusRestant: BONUS_HEBDOMMADAIRE,
  //     });
  //     expect(result.recap[1]).toEqual({
  //       date: '2025-07-22',
  //       pointsAutorises: POINTS_JOURNALIER,
  //       pointsConsommes: 27,
  //       bonusUtilise: 2,
  //       bonusRestant: BONUS_HEBDOMMADAIRE - 2,
  //     });

  //     for (let i = 2; i < 7; i++) {
  //       expect(result.recap[i].pointsConsommes).toBe(0);
  //     }
  //   });

  //  it('TEST 4 - devrait calculer le suivi avec plusieurs lignes le lundi à mercredi : bonus entamé de (2+12) points', async () => {
  //     const dateDebut = new Date('2025-07-21'); // un lundi

  //     const lignes: LigneJournalAlimentaireRow[] = [
  //       ...lignesLundi(), // 20 points
  //       ...lignesMardi(), // 27 points
  //       ...lignesMercredi(), // 37 points
  //     ];

  //     vi.mocked(JournalAlimentaireService.liste).mockResolvedValue(lignes);

  //    const retour = await calculerSuiviHebdo(1, dateDebut);
  //    const result = retour.resultats


  //     expect(result.semaine).toBe('2025-07-21');
  //     expect(result.bonusInitial).toBe(BONUS_HEBDOMMADAIRE);
  //     expect(result.bonusRestant).toBe(BONUS_HEBDOMMADAIRE - 14); // 2 pts de bonus

  //     expect(result.recap.length).toBe(7);
  //     expect(result.recap[0]).toEqual({
  //       date: '2025-07-21',
  //       pointsAutorises: POINTS_JOURNALIER,
  //       pointsConsommes: 20,
  //       bonusUtilise: 0,
  //       bonusRestant: BONUS_HEBDOMMADAIRE,
  //     });
  //     expect(result.recap[1]).toEqual({
  //       date: '2025-07-22',
  //       pointsAutorises: POINTS_JOURNALIER,
  //       pointsConsommes: 27,
  //       bonusUtilise: 2,
  //       bonusRestant: BONUS_HEBDOMMADAIRE - 2,
  //     });
  //     expect(result.recap[2]).toEqual({
  //       date: '2025-07-23',
  //       pointsAutorises: POINTS_JOURNALIER,
  //       pointsConsommes: 37,
  //       bonusUtilise: 12,
  //       bonusRestant: BONUS_HEBDOMMADAIRE - 14,
  //     });    

  //     for (let i = 3; i < 7; i++) {
  //       expect(result.recap[i].pointsConsommes).toBe(0);
  //     }
  //   });

  //  it('TEST 5 - devrait calculer le suivi avec plusieurs lignes le lundi à jeudi : bonus entamé de (2+12+5=19) points', async () => {
  //     const dateDebut = new Date('2025-07-21'); // un lundi

  //     const lignes: LigneJournalAlimentaireRow[] = [
  //       ...lignesLundi(), // 20 points
  //       ...lignesMardi(), // 27 points
  //       ...lignesMercredi(), // 37 points
  //       ...lignesJeudi(), // 30 points
  //     ];

  //     vi.mocked(JournalAlimentaireService.liste).mockResolvedValue(lignes);

  //    const retour = await calculerSuiviHebdo(1, dateDebut);
  //    const result = retour.resultats


  //     expect(result.semaine).toBe('2025-07-21');
  //     expect(result.bonusInitial).toBe(BONUS_HEBDOMMADAIRE);
  //     expect(result.bonusRestant).toBe(BONUS_HEBDOMMADAIRE - 19); 
    
  //     expect(result.recap.length).toBe(7);
  //     expect(result.recap[0]).toEqual({
  //       date: '2025-07-21',
  //       pointsAutorises: POINTS_JOURNALIER,
  //       pointsConsommes: 20,
  //       bonusUtilise: 0,
  //       bonusRestant: BONUS_HEBDOMMADAIRE,
  //     });
  //     expect(result.recap[1]).toEqual({
  //       date: '2025-07-22',
  //       pointsAutorises: POINTS_JOURNALIER,
  //       pointsConsommes: 27,
  //       bonusUtilise: 2,
  //       bonusRestant: BONUS_HEBDOMMADAIRE - 2,
  //     });
  //     expect(result.recap[2]).toEqual({
  //       date: '2025-07-23',
  //       pointsAutorises: POINTS_JOURNALIER,
  //       pointsConsommes: 37,
  //       bonusUtilise: 12,
  //       bonusRestant: BONUS_HEBDOMMADAIRE - 14,
  //     });    
  //     expect(result.recap[3]).toEqual({
  //       date: '2025-07-24',
  //       pointsAutorises: POINTS_JOURNALIER,
  //       pointsConsommes: 30,
  //       bonusUtilise: 5,
  //       bonusRestant: BONUS_HEBDOMMADAIRE - 19,
  //     });    

  //     for (let i = 4; i < 7; i++) {
  //       expect(result.recap[i].pointsConsommes).toBe(0);
  //     }
  //  });
    
  // it('TEST 6 - devrait calculer le suivi avec plusieurs lignes le lundi à vendredi : bonus entamé de (2+12+5+15=34) points', async () => {
  //     const dateDebut = new Date('2025-07-21'); // un lundi

  //     const lignes: LigneJournalAlimentaireRow[] = [
  //       ...lignesLundi(), // 20 points
  //       ...lignesMardi(), // 27 points
  //       ...lignesMercredi(), // 37 points
  //       ...lignesJeudi(), // 30 points
  //       ...lignesVendredi(), // 40 points
  //     ];

  //     vi.mocked(JournalAlimentaireService.liste).mockResolvedValue(lignes);
  //     const retour = await calculerSuiviHebdo(1, dateDebut);
  //     const result = retour.resultats


  //     expect(result.semaine).toBe('2025-07-21');
  //     expect(result.bonusInitial).toBe(BONUS_HEBDOMMADAIRE);
  //     expect(result.bonusRestant).toBe(BONUS_HEBDOMMADAIRE - 34); 
    
  //     expect(result.recap.length).toBe(7);
  //     expect(result.recap[0]).toEqual({
  //       date: '2025-07-21',
  //       pointsAutorises: POINTS_JOURNALIER,
  //       pointsConsommes: 20,
  //       bonusUtilise: 0,
  //       bonusRestant: BONUS_HEBDOMMADAIRE,
  //     });
  //     expect(result.recap[1]).toEqual({
  //       date: '2025-07-22',
  //       pointsAutorises: POINTS_JOURNALIER,
  //       pointsConsommes: 27,
  //       bonusUtilise: 2,
  //       bonusRestant: BONUS_HEBDOMMADAIRE - 2,
  //     });
  //     expect(result.recap[2]).toEqual({
  //       date: '2025-07-23',
  //       pointsAutorises: POINTS_JOURNALIER,
  //       pointsConsommes: 37,
  //       bonusUtilise: 12,
  //       bonusRestant: BONUS_HEBDOMMADAIRE - 14,
  //     });    
  //     expect(result.recap[3]).toEqual({
  //       date: '2025-07-24',
  //       pointsAutorises: POINTS_JOURNALIER,
  //       pointsConsommes: 30,
  //       bonusUtilise: 5,
  //       bonusRestant: BONUS_HEBDOMMADAIRE - 19,
  //     });    
  //     expect(result.recap[4]).toEqual({
  //       date: '2025-07-25',
  //       pointsAutorises: POINTS_JOURNALIER,
  //       pointsConsommes: 40,
  //       bonusUtilise: 15,
  //       bonusRestant: BONUS_HEBDOMMADAIRE - 34,
  //     });    
  //     for (let i = 5; i < 7; i++) {
  //       expect(result.recap[i].pointsConsommes).toBe(0);
  //     }
  // });  

  // it('TEST 7 - devrait calculer le suivi avec plusieurs lignes le lundi à samedi : bonus entamé de (2+12+5+15+3=37) points', async () => {
  //     const dateDebut = new Date('2025-07-21'); // un lundi

  //     const lignes: LigneJournalAlimentaireRow[] = [
  //       ...lignesLundi(), // 20 points
  //       ...lignesMardi(), // 27 points
  //       ...lignesMercredi(), // 37 points
  //       ...lignesJeudi(), // 30 points
  //       ...lignesVendredi(), // 40 points
  //       ...lignesSamedi(), // 28 points
  //     ];

  //     vi.mocked(JournalAlimentaireService.liste).mockResolvedValue(lignes);
  //     const retour = await calculerSuiviHebdo(1, dateDebut);
  //     const result = retour.resultats


  //     expect(result.semaine).toBe('2025-07-21');
  //     expect(result.bonusInitial).toBe(BONUS_HEBDOMMADAIRE);
  //     expect(result.bonusRestant).toBe(BONUS_HEBDOMMADAIRE - 35); 
    
  //     expect(result.recap.length).toBe(7);
  //     expect(result.recap[0]).toEqual({
  //       date: '2025-07-21',
  //       pointsAutorises: POINTS_JOURNALIER,
  //       pointsConsommes: 20,
  //       bonusUtilise: 0,
  //       bonusRestant: BONUS_HEBDOMMADAIRE,
  //     });
  //     expect(result.recap[1]).toEqual({
  //       date: '2025-07-22',
  //       pointsAutorises: POINTS_JOURNALIER,
  //       pointsConsommes: 27,
  //       bonusUtilise: 2,
  //       bonusRestant: BONUS_HEBDOMMADAIRE - 2,
  //     });
  //     expect(result.recap[2]).toEqual({
  //       date: '2025-07-23',
  //       pointsAutorises: POINTS_JOURNALIER,
  //       pointsConsommes: 37,
  //       bonusUtilise: 12,
  //       bonusRestant: BONUS_HEBDOMMADAIRE - 14,
  //     });    
  //     expect(result.recap[3]).toEqual({
  //       date: '2025-07-24',
  //       pointsAutorises: POINTS_JOURNALIER,
  //       pointsConsommes: 30,
  //       bonusUtilise: 5,
  //       bonusRestant: BONUS_HEBDOMMADAIRE - 19,
  //     });    
  //     expect(result.recap[4]).toEqual({
  //       date: '2025-07-25',
  //       pointsAutorises: POINTS_JOURNALIER,
  //       pointsConsommes: 40,
  //       bonusUtilise: 15,
  //       bonusRestant: BONUS_HEBDOMMADAIRE - 34,
  //     });    
  // expect(result.recap[5]).toEqual({
  //       date: '2025-07-26',
  //       pointsAutorises: POINTS_JOURNALIER,
  //       pointsConsommes: 28,
  //       bonusUtilise: 1,
  //       bonusRestant: BONUS_HEBDOMMADAIRE - 35,
  //     });    
  //     for (let i = 6; i < 7; i++) {
  //       expect(result.recap[i].pointsConsommes).toBe(0);
  //     }
  // });
    
  // it('TEST 8 - devrait calculer le suivi avec plusieurs lignes le lundi à dimanche : bonus entamé de (2+12+5+15+3+0=37) points', async () => {
  //     const dateDebut = new Date('2025-07-21'); // un lundi

  //   const lignes: LigneJournalAlimentaireRow[] = [
  //     ...lignesLundi(), // 20 points
  //     ...lignesMardi(), // 27 points
  //     ...lignesMercredi(), // 37 points
  //     ...lignesJeudi(), // 30 points
  //     ...lignesVendredi(), // 40 points
  //     ...lignesSamedi(), // 28 points
  //     ...lignesDimanche(), // 15 points
  //     ];

  //     vi.mocked(JournalAlimentaireService.liste).mockResolvedValue(lignes);
  //     const retour = await calculerSuiviHebdo(1, dateDebut);
  //       const result = retour.resultats


  //     expect(result.semaine).toBe('2025-07-21');
  //     expect(result.bonusInitial).toBe(BONUS_HEBDOMMADAIRE);
  //     expect(result.bonusRestant).toBe(BONUS_HEBDOMMADAIRE - 35); 
    
  //     expect(result.recap.length).toBe(7);
  //     expect(result.recap[0]).toEqual({
  //       date: '2025-07-21',
  //       pointsAutorises: POINTS_JOURNALIER,
  //       pointsConsommes: 20,
  //       bonusUtilise: 0,
  //       bonusRestant: BONUS_HEBDOMMADAIRE,
  //     });
  //     expect(result.recap[1]).toEqual({
  //       date: '2025-07-22',
  //       pointsAutorises: POINTS_JOURNALIER,
  //       pointsConsommes: 27,
  //       bonusUtilise: 2,
  //       bonusRestant: BONUS_HEBDOMMADAIRE - 2,
  //     });
  //     expect(result.recap[2]).toEqual({
  //       date: '2025-07-23',
  //       pointsAutorises: POINTS_JOURNALIER,
  //       pointsConsommes: 37,
  //       bonusUtilise: 12,
  //       bonusRestant: BONUS_HEBDOMMADAIRE - 14,
  //     });    
  //     expect(result.recap[3]).toEqual({
  //       date: '2025-07-24',
  //       pointsAutorises: POINTS_JOURNALIER,
  //       pointsConsommes: 30,
  //       bonusUtilise: 5,
  //       bonusRestant: BONUS_HEBDOMMADAIRE - 19,
  //     });    
  //     expect(result.recap[4]).toEqual({
  //       date: '2025-07-25',
  //       pointsAutorises: POINTS_JOURNALIER,
  //       pointsConsommes: 40,
  //       bonusUtilise: 15,
  //       bonusRestant: BONUS_HEBDOMMADAIRE - 34,
  //     });    
  //   expect(result.recap[5]).toEqual({
  //       date: '2025-07-26',
  //       pointsAutorises: POINTS_JOURNALIER,
  //       pointsConsommes: 28,
  //       bonusUtilise: 1,
  //       bonusRestant: BONUS_HEBDOMMADAIRE - 35,
  //   });    
  //   expect(result.recap[6]).toEqual({
  //       date: '2025-07-27',
  //       pointsAutorises: POINTS_JOURNALIER,
  //       pointsConsommes: 15,
  //       bonusUtilise: 0,
  //       bonusRestant: BONUS_HEBDOMMADAIRE - 35,
  //     });    
    
  // });

    
  // });


