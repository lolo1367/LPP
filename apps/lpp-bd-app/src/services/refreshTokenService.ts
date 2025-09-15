// src/services/refreshTokenService.ts

import pool from "../bd/db";
import { addDays } from "date-fns";
import { logConsole } from "@ww/reference";

const viewLog= true;
const emoji= ``;
const file= `refreshTokenService`;

export async function saveRefreshToken(userId: number, token: string) {
   let query : string ;
   let params: (string | number)[] = [];

   const expiresAt = addDays(new Date(), 30).toISOString(); // refresh valide 30j

   try {
      query = `INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3) ;`;
      params = [userId, token, expiresAt];

      await pool.query(query, params);
      
   } catch (err) {
      logConsole (viewLog, emoji, file + `/saveRefreshToken`, `Erreur lors de la sauvegarde du token : (userID : ${userId} , token : ${token}`, err);
      throw err ;  
  }  
}

export async function findRefreshToken(token: string) {
   let query : string ;
   let params: (string)[] = [];   
   
   try {
      query=`SELECT * FROM refresh_tokens WHERE token = $1 AND expires_at > NOW();`;

      params = [token];
         logConsole(viewLog, emoji, file + `findRefreshToken`, `query`, query);
         logConsole (viewLog, emoji, file + `findRefreshToken`, `params`, params);

      const res = await pool.query(query, params);
      logConsole (viewLog, emoji, file + `findRefreshToken`, `res`, res);

      return res.rows;

   } catch (err) {
      logConsole (viewLog, emoji, file + `findRefreshToken`, `Erreur lors de la vérification de la présence du token : ${token}`, err);
      throw err ;  
   }  
}

export async function deleteRefreshToken(token: string) {
   let query : string ;
   let params: (string)[] = [];   
   try {


      query = `DELETE FROM refresh_tokens WHERE token = $1;`;
      params = [token];

      logConsole(viewLog, emoji, file + `deleteRefreshToken`, `query`, query);
      logConsole (viewLog, emoji, file + `deleteRefreshToken`, `params`, params);
      const res = await pool.query(query, params);
      logConsole(viewLog, emoji, file + `deleteRefreshToken`, `res`, res);
      return res.rows ;


   } catch (err) {
      logConsole (viewLog, emoji, file + `deleteRefreshToken`, `Erreur lors de la suprresion du token : ${token}`, err);
      throw err ;
   } 
}

export async function deleteAllUserTokens(userId: number) {
   
   try {
      const res = pool.query(`DELETE FROM refresh_tokens WHERE user_id = $1`, [userId]);
      return (await res).rowCount;

   } catch (err) {
      logConsole (viewLog, emoji, file + `deleteAllUserTokens`, `Erreur lors suppression des tokens de :` + userId, err);
      throw err ;
   }   
}
