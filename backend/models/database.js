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

// Scope per caricare un avvistamento con tutti i commenti e fotoUrl
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
        model: Comment,
        separate: true, 
        order: [['createdAt', 'DESC']]  // Ordina i commenti dal più recente al più vecchio
      }
    ]
  });

// Scope per caricare tutti gli avvistamenti sulla mappa e sulla lista (senza commenti e foto)
CatSighting.addScope('all', {  
  attributes: {
    exclude: ['photo'] 
  },
  order: [['updatedAt', 'DESC' ]], // Ordina in modo da mostrare i nuovi avvistamenti per primi (i più recenti)
});


// synchronize schema (creates missing tables)
database.sync().then( () => {
  console.log("✅💾 Sincronizzazione del database completata 💾✅");
}).catch( err => {
  console.error("❌ Errore nella sincronizzazione del database ❌\n" + err.message);
});