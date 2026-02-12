import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';
import { serviceManagementApiRequest } from '../../shared/transport';
import { cleanBody, processResponse } from '../../shared/utils';

export const updateTicketDescription: INodeProperties[] = [
	{
		displayName: 'Service ID',
		name: 'service_id',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['ticket'],
				operation: ['updateTicket'],
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
				operation: ['updateTicket'],
			},
		},
		description: 'ID của phiếu (root ID)',
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
				operation: ['updateTicket'],
			},
		},
		description: 'Username là người cập nhật phiếu',
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['ticket'],
				operation: ['updateTicket'],
			},
		},
		options: [
			{
				displayName: 'Assignees',
				name: 'assignees',
				type: 'string',
				default: '',
				description: 'Người thực thi phiếu (dùng khi khối có danh sách người thực thi cố định)',
			},
			{
				displayName: 'Current Ticket Block ID',
				name: 'current_ticket_block_id',
				type: 'string',
				default: '',
				description: 'ID khối hiện tại của phiếu (để trống sẽ tự động xác định khối luồng chính)',
			},
			{
				displayName: 'Followers',
				name: 'followers',
				type: 'string',
				default: '',
				description: 'Người theo dõi phiếu (nhiều người cách nhau bằng dấu phẩy)',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Tên phiếu',
			},
			{
				displayName: 'Root Content',
				name: 'root_content',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				default: '',
				description: 'Mô tả phiếu',
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
				operation: ['updateTicket'],
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
						placeholder: 'e.g., text, lua_chon_1, date, bang_1',
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
	const updateFields = this.getNodeParameter('updateFields', index, {}) as IDataObject;

	// Process custom fields (service_ prefix)
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
		...updateFields,
		...customFields,
	});

	const response = await serviceManagementApiRequest.call(this, 'POST', '/ticket/edit', body);

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
