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
    functions.logger.log('userId recieved: ' + data.userId);
    try {
        const createTokenResponse = await client.linkTokenCreate(configs);
        functions.logger.log(createTokenResponse.data);
        return createTokenResponse.data;
    } catch (error) {
        functions.logger.log(error.response);
        return formatError(error.response);
    }
});
/*
expecting data object of form:
{
    publicToken:<String>
}
*/
exports.exchangePublicToken = functions.https.onCall(async (data, context) => {
    publicToken = data.publicToken;
    try {
        const tokenResponse = await client.itemPublicTokenExchange({
            public_token: publicToken,
        });

        ACCESS_TOKEN = tokenResponse.data.access_token;
        ITEM_ID = tokenResponse.data.item_id;
        return {
            access_token: ACCESS_TOKEN,
            item_id: ITEM_ID,
            error: null,
        };
    } catch (error) {
        functions.logger.log(error.response);
        return formatError(error.response);
    }
});

exports.getTransactions = functions.https.onCall(async (data, context) => {
    const request = {
        access_token: data.accessToken,
        start_date: '2020-01-01',
        end_date: '2020-07-01'
    };
    functions.logger.log(request['access_token']);
    try {
        const response = await client.transactionsGet(request);
        transactions = response.data.transactions;
        const total_transactions = response.data.total_transactions;
        // Manipulate the offset parameter to paginate
        // transactions and retrieve all available data
        while (transactions.length < total_transactions) {
            const paginatedRequest = {
                access_token: accessToken,
                start_date: '2020-01-01',
                end_date: '2020-07-01',
                options: {
                    offset: transactions.length,
                },
            };
            const paginatedResponse = await client.transactionsGet(paginatedRequest);
            transactions = transactions.concat(
                paginatedResponse.data.transactions,
            );
        }
        return transactions
    } catch (error) {
        //functions.logger.log('get trans error: ' + error.response);
        return formatError(error.response);
    }
});