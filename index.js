// Singandu Academia — envoi des notifications push quand une alerte est créée dans « notifs »
const {onDocumentCreated}=require('firebase-functions/v2/firestore');
const {defineSecret}=require('firebase-functions/params');
const admin=require('firebase-admin');
const webpush=require('web-push');
admin.initializeApp();

const VAPID_PRIVATE=defineSecret('VAPID_PRIVATE');
const VAPID_PUBLIC='BPVhQpAHHFSicyKn1pJkWB9N1eMn1Ek75NUYWJfdqMTvjtV7nUVGxlj44Pxj05Gko0-sbTJumj860oLdaQVf8pU';   // la même que dans m-push.js

exports.pushNotif=onDocumentCreated(
  {document:'notifs/{id}',secrets:[VAPID_PRIVATE],region:'europe-west1',maxInstances:3},
  async ev=>{
    const n=ev.data.data();
    webpush.setVapidDetails('mailto:singanduacademia@gmail.com',VAPID_PUBLIC,VAPID_PRIVATE.value());
    const db=admin.firestore();
    const snap=n.to==='all'
      ? await db.collection('pushsubs').get()
      : await db.collection('pushsubs').where('uid','==',n.to).get();
    const payload=JSON.stringify({titre:n.titre||'Singandu Academia',texte:String(n.texte||'').slice(0,160),de:n.de||''});
    await Promise.all(snap.docs.map(async d=>{
      try{await webpush.sendNotification(JSON.parse(d.data().sub),payload)}
      catch(e){if(e.statusCode===404||e.statusCode===410)await d.ref.delete()}   // abonnement expiré
    }));
  });
