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
		displayName: 'Service ID',
		name: 'service_id',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['ticket'],
				operation: ['updateTicketCustomFields'],
			},
		},
		description: 'ID của Service',
	},
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
		description: 'ID của phiếu',
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
		description: 'Username người cập nhật',
	},
	{
		displayName: 'Custom Field IDs',
		name: 'custom_field_ids',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['ticket'],
				operation: ['updateTicketCustomFields'],
			},
		},
		description: 'Danh sách ID các custom field cần cập nhật (cách nhau bằng dấu phẩy, ví dụ: service_text, service_lua_chon_1)',
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
		description: 'Custom fields của phiếu (service_ prefix)',
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
						placeholder: 'e.g., text, lua_chon_1, date, bay_thay_bo',
						description: 'Tên custom field ("service_" prefix sẽ tự động thêm vào)',
					},
					{
						displayName: 'Field Value',
						name: 'value',
						type: 'string',
						default: '',
						description: 'Giá trị của custom field',
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

	const serviceId = this.getNodeParameter('service_id', index) as string;
	const ticketId = this.getNodeParameter('ticketId', index) as string;
	const username = this.getNodeParameter('username', index) as string;
	const customFieldIds = this.getNodeParameter('custom_field_ids', index) as string;
	
	const customFieldsData = this.getNodeParameter('customFields', index, {}) as IDataObject;
	const customFields: IDataObject = {};
	
	if (customFieldsData.fields && Array.isArray(customFieldsData.fields)) {
		for (const field of customFieldsData.fields as Array<{name: string; value: string}>) {
			if (field.name && field.value) {
				const fieldName = field.name.startsWith('service_') ? field.name : `service_${field.name}`;
				customFields[fieldName] = field.value;
			}
		}
	}

	const body: IDataObject = cleanBody({
		service_id: serviceId,
		ticket_id: ticketId,
		username,
		custom_field_ids: customFieldIds,
		...customFields,
	});

	const response = await serviceManagementApiRequest.call(this, 'POST', '/ticket/edit.custom.fields', body);

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
