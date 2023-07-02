import { ConfigManager } from './app.module.configmanager.js';

export async function AuthClient() {
    
    /****************************************************************
     * PUBLIC FUNCTIONS
     ****************************************************************/

    /**
     * @function login
     * @description Performs the authentication flow
     */
    async function login() {

        const config = await ConfigManager();
        const redirectUrl = chrome.identity.getRedirectURL('auth0');
        const codeVerifier = base64URLEncode(crypto.randomBytes(32));
        const codeChallenge = base64URLEncode(sha256(codeVerifier));

        this.$store.commit('settings/SET_CODE_VERIFIER', codeVerifier);

        const options = {
            client_id: config.client_id,
            redirect_uri: redirectUrl,
            response_type: 'code',
            scope: 'offline_access openid profile email',
            audience: config.apiEndpoint,
            code_challenge: codeChallenge,
            code_challenge_method: 'S256'
        }

        const url = `https://${config.domain}/authorize?${stringify(options)}`;

        const resultUrl = await new Promise((resolve, reject) => {

            chrome.identity.launchWebAuthFlow({
                url,
                interactive: true
            }, callbackUrl => {
                resolve(callbackUrl);
            });
    
        });
    
        if (resultUrl) {
    
            const code = parse(resultUrl.split('?')[1]).code;
    
            const body = JSON.stringify({
                redirect_uri: redirectUrl,
                grant_type: 'authorization_code',
                client_id: config.client_id,
                code_verifier: codeVerifier,
                code,
                scope: 'offline_access openid profile email'
            })
    
            const result = await axios.post(`https://${config.domain}/oauth/token`, body, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
    
            if (result && result.data && result.data.access_token && result.data.expires_in && result.data.refresh_token) 
            {
                this.$store.commit('settings/SET_ACCESS_TOKEN', result.data.access_token);
                this.$store.commit('settings/SET_ACCESS_TOKEN_EXPIRES_AT', dayjs().add(result.data.expires_in, 'seconds').unix());
                this.$store.commit('settings/SET_REFRESH_TOKEN', result.data.refresh_token);
    
                this.$store.dispatch('ui/fetchCurrentUser');
    
            } 
            else {
    
                this.appNotify({
                    type: 'error',
                    title: 'Error',
                    text: 'Auth0 Authentication Data was invalid'
                });
    
            }
    
        }
        else {
    
            this.appNotify({
                type: 'error',
                title: 'Error',
                text: 'Auth0 Cancelled or error'
            });
    
        }
    }

    function logoff() {

    }

    /****************************************************************
     * PRIVATE FUNCTIONS
     ****************************************************************/

    function base64URLEncode(str) {
        return str.toString('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=/g, '');
    }

    function sha256(buffer) {
        return crypto.createHash('sha256').update(buffer).digest();
    }


    return {
        login: login
    }
}