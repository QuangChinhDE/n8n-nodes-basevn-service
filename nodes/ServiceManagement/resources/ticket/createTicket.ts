import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';
import { serviceManagementApiRequest } from '../../shared/transport';
import { cleanBody, processResponse } from '../../shared/utils';

export const createTicketDescription: INodeProperties[] = [
	{
		displayName: 'Username',
		name: 'username',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['ticket'],
				operation: ['createTicket'],
			},
		},
		description: 'Username of ticket creator',
	},
	{
		displayName: 'Service ID',
		name: 'service_id',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['ticket'],
				operation: ['createTicket'],
			},
		},
		description: 'ID of the service',
	},
	{
		displayName: 'Ticket Name',
		name: 'name',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['ticket'],
				operation: ['createTicket'],
			},
		},
		description: 'Name/title of the ticket',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['ticket'],
				operation: ['createTicket'],
			},
		},
		options: [
			{
				displayName: 'Content',
				name: 'content',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				default: '',
				description: 'Description/content of the ticket',
			},
			{
				displayName: 'Compound ID',
				name: 'compound_id',
				type: 'string',
				default: '',
				description: 'ID of the compound',
			},
			{
				displayName: 'Group ID',
				name: 'group_id',
				type: 'string',
				default: '',
				description: 'ID of the group',
			},
		],
	},
	{
		displayName: 'Custom Fields',
		name: 'customFields',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		placeholder: 'Add Custom Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['ticket'],
				operation: ['createTicket'],
			},
		},
		description: 'Custom fields specific to the service',
		options: [
			{
				name: 'fields',
				displayName: 'Field',
				values: [
					{
						displayName: 'Field Name',
						name: 'name',
						type: 'string',
						default: '',
						placeholder: 'e.g., field_name',
						description: 'Name of the custom field ("custom_" prefix will be added automatically)',
					},
					{
						displayName: 'Field Value',
						name: 'value',
						type: 'string',
						default: '',
						description: 'Value of the custom field',
					},
				],
			},
		],
	},
];

export async function execute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	const username = this.getNodeParameter('username', index) as string;
	const serviceId = this.getNodeParameter('service_id', index) as string;
	const name = this.getNodeParameter('name', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;
	
	const customFieldsData = this.getNodeParameter('customFields', index, {}) as IDataObject;
	const customFields: IDataObject = {};
	
	if (customFieldsData.fields && Array.isArray(customFieldsData.fields)) {
		for (const field of customFieldsData.fields as Array<{name: string; value: string}>) {
			if (field.name && field.value) {
				const fieldName = field.name.startsWith('custom_') ? field.name : `custom_${field.name}`;
				customFields[fieldName] = field.value;
			}
		}
	}

	const body: IDataObject = cleanBody({
		username,
		service_id: serviceId,
		name,
		...additionalFields,
		...customFields,
	});

	const response = await serviceManagementApiRequest.call(this, 'POST', '/ticket/create', body);

	if (response.code === 1) {
		const result = processResponse(response, '');
		returnData.push({
			json: result,
			pairedItem: index,
		});
	} else {
		const errorMsg = response.message || JSON.stringify(response) || 'Unknown error';
		throw new Error(`API Error: ${errorMsg}`);
	}

	return returnData;
}
