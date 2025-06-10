import { Sequelize } from "sequelize";
import { createModel as createUserModel } from "./user.js";
import { createModel as createCatSightingModel } from "./catSighting.js";
import { createModel as createCommentModel } from "./comment.js";

import 'dotenv/config.js'; //read .env file and make it available in process.env

export const database = new Sequelize(process.env.DB_CONNECTION_URI, {
  dialect: process.env.DIALECT
});

createUserModel(database);
createCatSightingModel(database);
createCommentModel(database);

export const {User, CatSighting, Comment} = database.models;


// Associations: 

CatSighting.belongsTo(User); // un avvistamento ha chiave esterna utente

// Un Commento ha 2 chiavi esterne: gatto e utente
Comment.belongsTo(CatSighting);
Comment.belongsTo(User);

CatSighting.hasMany(Comment); // Un gatto può avere più commenti
User.hasMany(CatSighting); // Un utente può avere più gatti (avvistamenti)

// Scope:

// Scope per visualizzare gli avvistamenti sulla mappa
CatSighting.addScope('forMap', {
  attributes: ['id', 'title', 'publicationDate' ,'latitude', 'longitude'],
});

// Scope per caricare gli avvistamenti completi di autore e numero totale di commenti per avvistamento
CatSighting.addScope('full', {  
  attributes: {
    include: [
      [
        Sequelize.literal(`(
          SELECT COUNT(*)
          FROM "Comments" AS "Comment"
          WHERE "Comment"."CatSightingId" = "CatSighting"."id"
        )`),
        'totalComments'
      ]
    ]
  },
  include: [
    {
      model: Comment
    }
  ]
});
// TODO aggiusta e prova
// Scope per caricare gli avvistamenti sulla lista (uguale a full ma senza i commenti e con ordine dal piu recente)
CatSighting.addScope('forList', {  
  attributes: {
    include: [
      [
        Sequelize.literal(`(
          SELECT COUNT(*)
          FROM "Comments" AS "Comment"
          WHERE "Comment"."CatSightingId" = "CatSighting"."id"
        )`),
        'totalComments'
      ]
    ]
  },
  order: [['publicationDate', 'DESC']], // Ordina dal più recente
});


// synchronize schema (creates missing tables)
database.sync().then( () => {
  console.log("✅💾 Sincronizzazione del database completata 💾✅");
}).catch( err => {
  console.error("❌ Errore nella sincronizzazione del database ❌\n" + err.message);
});