import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { getAccessToken, setLnbitUrl } from '../services/lnbitsService';
import { getCredentials } from '../services/utils';

const showUsers: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('Getting Users from LNBits');

    // Log all headers
    context.log("Headers:", req.headers);

    try {
        // Extract credentials from the request
        const { username, password, siteUrl, adminKey } = getCredentials(req);

        if (!username || !password || !siteUrl || !adminKey) {
            context.res = {
                status: 400,
                body: "Missing required parameters: username, password, siteUrl, or adminKey"
            };
            return;
        }

        // Set the lnbiturl
        setLnbitUrl(req);

        // Get access token
        const accessToken = await getAccessToken(req, username, password);
        context.log('Access Token:', accessToken);

        // Get users
        const users = await getUsers(req, adminKey,siteUrl);
        context.log('Users:', users);
        context.res = {status:200 , body:JSON.stringify(users)};

    } catch (error) {
        context.log('Error:', error);
        context.res = {
            status: 500,
            body: `Error: ${error.message}`
        };
    }
};

const getUsers = async (
    req: HttpRequest,
    adminKey: string,
    lnbiturl: string
): Promise<any> => {
    console.log(`getUsers starting ... (adminKey: ${adminKey})`);

    console.log(`LNBits URL: ${lnbiturl}`);
    try {
        // Use Core Users API - get wallets as proxy for users
        const { username, password } = getCredentials(req);
        const accessToken = await getAccessToken(req, username, password);
        const response = await fetch(
            `${lnbiturl}/api/v1/wallets`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
            },
        );

        if (!response.ok) {
            throw new Error(`Error getting users (status: ${response.status}): ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error in getUsers:', error);
        return null;
    }
};

export default showUsers;