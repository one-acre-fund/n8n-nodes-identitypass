import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class IdentityPassCredentialsApi implements ICredentialType {
	name = 'identityPassCredentialsApi';
	displayName = 'IdentityPass Credentials API';
	properties: INodeProperties[] = [
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			default: 'https://api.myidentitypass.com',
			placeholder: 'Should be https://api.myidentitypass.com by default',
			type: 'string',
		},
		{
			displayName: 'App ID',
			name: 'appId',
			default: '',
			description: 'Get it from https://dashboard.myidentitypass.com/My-Apps',
			type: 'string',
			typeOptions: {
				password: true,
			},
		},
		{
			displayName: 'Private API Key',
			name: 'apiKey',
			default: '',
			description: 'Get it from https://dashboard.myidentitypass.com/My-Apps',
			type: 'string',
			typeOptions: {
				password: true,
			},
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'app-id': '={{$credentials.appId}}',
				'x-api-key': '={{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.baseUrl}}',
			url: '/api/v1/biometrics/merchant/data/wallet/balance',
		},
	};
}
