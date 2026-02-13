import type {
	IWebhookFunctions,
	INodeType,
	INodeTypeDescription,
	IWebhookResponseData,
	IDataObject,
} from 'n8n-workflow';

export class ServiceManagementTrigger implements INodeType {
	usableAsTool = true;

	description: INodeTypeDescription = {
		displayName: 'BaseVN - App Service Trigger',
		name: 'serviceManagementTrigger',
		icon: 'file:../../icons/service.svg',
		group: ['trigger'],
		version: 1,
		description: 'Starts the workflow when BaseVN Service webhook events occur',
		defaults: {
			name: 'BaseVN Service Trigger',
		},
		inputs: [],
		outputs: ['main'],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: '={{$parameter["path"]}}',
			},
		],
		properties: [
			{
				displayName: 'Webhook Path',
				name: 'path',
				type: 'string',
				default: 'webhook',
				required: true,
				placeholder: 'webhook',
				description: 'The path for the webhook URL. Leave as default or customize it.',
			},
			{
				displayName: 'Response Selector',
				name: 'responseSelector',
				type: 'options',
				options: [
					{
						name: 'Full Payload',
						value: '',
						description: 'Return complete webhook payload',
					},
					{
						name: 'Body Only',
						value: 'body',
						description: 'Return only the body data',
					},
					{
						name: 'Ticket Info',
						value: 'ticketInfo',
						description: 'Return simplified ticket information',
					},
				],
				default: 'body',
				description: 'Select which data to return from webhook',
			},
		],
		usableAsTool: true,
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const bodyData = this.getBodyData() as IDataObject;
		const responseSelector = this.getNodeParameter('responseSelector', '') as string;

		// Process response based on selector
		let returnData: IDataObject = bodyData;

		if (responseSelector === 'ticketInfo') {
			// Return simplified ticket information
			const serviceFields: IDataObject = {};
			
			// Extract all service_* custom fields
			Object.keys(bodyData).forEach((key) => {
				if (key.startsWith('service_')) {
					serviceFields[key] = bodyData[key];
				}
			});

			returnData = {
				id: bodyData.id,
				type: bodyData.type,
				name: bodyData.name,
				content: bodyData.content,
				status: bodyData.status,
				username: bodyData.username,
				user_id: bodyData.user_id,
				root_id: bodyData.root_id,
				root_name: bodyData.root_name,
				root_content: bodyData.root_content,
				block_id: bodyData.block_id,
				block_metatype: bodyData.block_metatype,
				service_id: bodyData.service_id,
				group_id: bodyData.group_id,
				prev_id: bodyData.prev_id,
				created_at: bodyData.since,
				updated_at: bodyData.last_update,
				started_at: bodyData.start_ticket_at,
				link: bodyData.link,
				followers: bodyData.followers,
				// Include all service custom fields
				...(Object.keys(serviceFields).length > 0 ? { custom_fields: serviceFields } : {}),
			};
		} else if (responseSelector === '') {
			// Return full payload including headers
			const headerData = this.getHeaderData();
			returnData = {
				headers: headerData,
				body: bodyData,
			};
		}
		// else: Return body only (default) - returnData is already bodyData

		return {
			workflowData: [this.helpers.returnJsonArray(returnData)],
		};
	}
}
