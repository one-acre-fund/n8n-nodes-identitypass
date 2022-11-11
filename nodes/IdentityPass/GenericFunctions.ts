import { IExecuteFunctions, ILoadOptionsFunctions } from 'n8n-core';

import { IDataObject, IHookFunctions, IHttpRequestOptions, IWebhookFunctions } from 'n8n-workflow';

export async function identityPassApiRequest(
	this: IExecuteFunctions | IWebhookFunctions | IHookFunctions | ILoadOptionsFunctions,
	option: IDataObject = {},
	// tslint:disable:no-any
): Promise<any> {
	const credentials = (await this.getCredentials('identityPassCredentialsApi')) as IDataObject;

	const options: IHttpRequestOptions = {
		url: '',
		baseURL: String(credentials.baseUrl),
		headers: {
			'app-id': credentials.appId,
			'x-api-key': credentials.apiKey,
		},
		json: true,
	};
	if (Object.keys(option)) {
		Object.assign(options, option);
	}

	return this.helpers.httpRequest(options);
}
