import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';
import { serviceManagementApiRequest } from '../../shared/transport';
import { cleanBody, processResponse } from '../../shared/utils';

export const updateTicketCustomFieldsDescription: INodeProperties[] = [
	{
		displayName: 'Ticket ID',
		name: 'ticketId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['ticket'],
				operation: ['updateTicketCustomFields'],
			},
		},
		description: 'The ID of the ticket',
	},
	{
		displayName: 'Username',
		name: 'username',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['ticket'],
				operation: ['updateTicketCustomFields'],
			},
		},
		description: 'Username performing the update',
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
				operation: ['updateTicketCustomFields'],
			},
		},
		description: 'Custom fields to update',
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

	const ticketId = this.getNodeParameter('ticketId', index) as string;
	const username = this.getNodeParameter('username', index) as string;
	
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
		id: ticketId,
		username,
		...customFields,
	});

	const response = await serviceManagementApiRequest.call(this, 'POST', '/ticket/custom_field/update', body);

	if (response.code === 1) {
		const result = processResponse(response, '');
		returnData.push({
			json: result,
			pairedItem: index,
		});
	} else {
		throw new Error(`API Error: ${response.message || 'Unknown error'}`);
	}

	return returnData;
}
