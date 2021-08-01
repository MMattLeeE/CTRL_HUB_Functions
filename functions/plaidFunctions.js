//using plaid node client beta
//npm install plaid@beta
const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');
const functions = require('firebase-functions');
const cred = require('./config.json');

//plaid functions and variables
//create the configureation for client object:
const configuration = new Configuration({
    //using sandbox enviroment
    basePath: PlaidEnvironments.sandbox,
    baseOptions: {
        headers: {
            'PLAID-CLIENT-ID': cred['client_id'],
            'PLAID-SECRET': cred['sandbox_secret'],
            'Plaid-Version': '2020-09-14',
        },
    },
});

//create client object:
const client = new PlaidApi(configuration);

/*
Client app will call this function to initiate getting a link token. 
The Client then uses the link token to go through the authorization 
process and link bank accounts etc

data object:
{
    userId: <String>
}

*/
exports.getLinkToken = functions.https.onCall(async (data, context) => {
    const configs = {
        user: {
            // This should correspond to a unique id for the current user.
            client_user_id: data.userId,
        },
        client_name: 'CTRL Hub',
        products: ['auth', 'transactions'],
        country_codes: ['US'],
        language: 'en',
    };
    functions.logger.log('userId recieved: '+ data.userId);
    try {
        const createTokenResponse = await client.linkTokenCreate(configs);
        functions.logger.log(createTokenResponse.data);
        return createTokenResponse.data;
    } catch (error) {
        functions.logger.log(error.response);
        return formatError(error.response);
    }
});