// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');
const plaidFunctions = require('./plaidFunctions');

// The Firebase Admin SDK to access Firestore.
const admin = require('firebase-admin');
admin.initializeApp();

exports.getLinkToken = plaidFunctions.getLinkToken;
exports.exchangePublicToken = plaidFunctions.exchangePublicToken;
exports.getTransactions = plaidFunctions.getTransactions;