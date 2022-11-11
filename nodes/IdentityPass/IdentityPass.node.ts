import { IExecuteFunctions } from 'n8n-core';
import {
	IDataObject,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

import { identityPassApiRequest } from './GenericFunctions';

export class IdentityPass implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'IdentityPass',
		subtitle: '={{$parameter["operation"] + ": " + $parameter["country"]}}',
		documentationUrl: 'https://github.com/one-acre-fund/n8n-nodes-identitypass',
		name: 'identityPass',
		// eslint-disable-next-line n8n-nodes-base/node-class-description-icon-not-svg
		icon: 'file:identityPass.png',
		group: ['transform'],
		version: 1,
		description: 'A node to access identity verification services',
		defaults: {
			name: 'IdentityPass',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'identityPassCredentialsApi',
				required: true,
			},
		],
		properties: [
			// Resources
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Data Verification',
						value: 'data',
						description: 'Verify Identitication Details',
					},
					{
						name: 'Document Image Verification',
						value: 'document',
						description: 'Verify Document Images',
					},
				],
				default: 'data',
				required: true,
			},

			// Operations
			{
				displayName: 'Country',
				name: 'country',
				type: 'options',
				required: true,
				noDataExpression: true,
				default: 'KE',
				options: [
					{
						name: 'Kenya',
						value: 'KE',
					},
					{
						name: 'Nigeria',
						value: 'NG',
					},
					{
						name: 'Uganda',
						value: 'UG',
					},
				],
			},

			// options for: create link
			{
				displayName: 'Verification Type',
				name: 'type',
				type: 'options',
				default: 'nationalId',
				description: 'The target URL to point to',
				required: true,
				displayOptions: {
					show: {
						resource: ['data'],
					},
				},
				options: [
					{
						name: 'National ID',
						value: 'nationalId',
						displayOptions: {
							show: {
								country: ['KE', 'NG'],
							},
						},
					},
					{
						name: 'Passport',
						value: 'passport',
						displayOptions: {
							show: {
								country: ['KE', 'NG'],
							},
						},
					},
				],
			},

			{
				displayName: 'Reference Number',
				name: 'customer_reference',
				type: 'string',
				default: '',
				required: true,
				description: 'A unique reference for the caller',
				displayOptions: {
					show: {
						resource: ['data'],
						type: ['nationalId'],
						country: ['KE'],
					},
				},
			},

			{
				displayName: 'User Last Name',
				name: 'customer_name',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['data'],
						type: ['nationalId'],
						country: ['KE'],
					},
				},
			},

			{
				displayName: 'ID Number to Validate',
				name: 'number',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['data'],
						type: ['nationalId'],
						country: ['KE'],
					},
				},
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();

		// tslint:disable-next-line: no-any
		let returnData: any[] = [];
		// tslint:disable-next-line: no-any
		let responseData: any;
		const resource = this.getNodeParameter('resource', 0) as string;
		const type = this.getNodeParameter('type', 0) as string;
		const country = this.getNodeParameter('country', 0) as string;

		for (let i = 0; i < items.length; i++) {
			if (resource === 'data') {
				if (type === 'nationalId') {
					if (country === 'KE') {
						const customer_reference = this.getNodeParameter('customer_reference', i) as string;
						const customer_name = this.getNodeParameter('customer_name', i) as string;
						const number = this.getNodeParameter('number', i) as string;

						responseData = await identityPassApiRequest.call(this, {
							method: 'POST',
							url: '/api/v2/biometrics/merchant/data/verification/ke/national_id/new',
							body: {
								customer_name,
								number,
								customer_reference,
							},
						});

						returnData = returnData.concat(responseData);
					}
				}
			}
		}

		return [this.helpers.returnJsonArray(returnData)];
	}
}
