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
		description: 'Username là người tạo phiếu',
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
		description: 'ID của Service',
	},
	{
		displayName: 'Block ID',
		name: 'block_id',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['ticket'],
				operation: ['createTicket'],
			},
		},
		description: 'ID của block',
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
		description: 'Tên phiếu',
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
				displayName: 'Assignees',
				name: 'assignees',
				type: 'string',
				default: '',
				description: 'Người thực thi phiếu (dùng khi khối có danh sách người thực thi cố định)',
			},
			{
				displayName: 'Followers',
				name: 'followers',
				type: 'string',
				default: '',
				description: 'Người theo dõi phiếu (nhiều người cách nhau bằng dấu phẩy)',
			},
			{
				displayName: 'Managers',
				name: 'managers',
				type: 'string',
				default: '',
				description: 'Quản lý thực thi (dùng khi khối là duyệt có yêu cầu QLTT)',
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
						placeholder: 'e.g., lua_chon_1, date, base_thay_bo',
						description: 'Tên custom field ("service_" prefix sẽ tự động thêm vào)',
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
	const blockId = this.getNodeParameter('block_id', index) as string;
	const name = this.getNodeParameter('name', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;
	
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
		username,
		service_id: serviceId,
		block_id: blockId,
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
