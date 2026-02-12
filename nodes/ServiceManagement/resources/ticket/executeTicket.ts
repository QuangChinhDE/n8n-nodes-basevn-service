import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';
import { serviceManagementApiRequest } from '../../shared/transport';
import { cleanBody, processResponse } from '../../shared/utils';

export const executeTicketDescription: INodeProperties[] = [
	{
		displayName: 'Ticket ID',
		name: 'ticketId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['ticket'],
				operation: ['executeTicket'],
			},
		},
		description: 'ID phiếu',
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
				operation: ['executeTicket'],
			},
		},
		description: 'Người dùng có quyền thực thi phiếu',
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
				operation: ['executeTicket'],
			},
		},
		options: [
			{
				displayName: 'Current Ticket Block ID',
				name: 'current_ticket_block_id',
				type: 'string',
				default: '',
				description: 'ID khối hiện tại của phiếu (để trống sẽ tự động xác định khối luồng chính)',
			},
			{
				displayName: 'Intent',
				name: 'intent',
				type: 'options',
				options: [
					{ name: 'Approve', value: 'approve' },
					{ name: 'Ask For More Info', value: 'ask' },
					{ name: 'Execute (Default)', value: '' },
					{ name: 'Mark Done', value: 'mark_done' },
					{ name: 'Mark Failed', value: 'mark_failed' },
					{ name: 'Reject', value: 'reject' },
				],
				default: '',
				description: 'Mục đích hành động: Để trống = Thực thi khối, approve = Duyệt, reject = Từ chối, ask = Yêu cầu bổ sung, mark_done = Hoàn thành, mark_failed = Thất bại',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Tên phiếu (nếu muốn cập nhật)',
			},
			{
				displayName: 'Note',
				name: 'note',
				type: 'string',
				typeOptions: {
					rows: 3,
				},
				default: '',
				description: 'Ghi chú khi thực hiện khối duyệt/bước',
			},
		],
	},
	{
		displayName: 'Ticket Custom Fields (service_)',
		name: 'ticketCustomFields',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		placeholder: 'Add Ticket Custom Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['ticket'],
				operation: ['executeTicket'],
			},
		},
		description: 'Custom fields của phiếu (phải điền đầy đủ CF bắt buộc nếu muốn tự động move qua khối tiếp theo)',
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
						placeholder: 'e.g., text, int, date, bay_thay_bo',
						description: 'Tên custom field của phiếu ("service_" prefix sẽ tự động thêm)',
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
	{
		displayName: 'Block Custom Fields (custom_)',
		name: 'blockCustomFields',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		placeholder: 'Add Block Custom Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['ticket'],
				operation: ['executeTicket'],
			},
		},
		description: 'Custom fields của khối hiện tại',
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
						placeholder: 'e.g., ngay_hoan_thanh',
						description: 'Tên custom field của khối ("custom_" prefix sẽ tự động thêm)',
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

	const ticketId = this.getNodeParameter('ticketId', index) as string;
	const username = this.getNodeParameter('username', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

	// Process ticket custom fields (service_ prefix)
	const ticketCustomFieldsData = this.getNodeParameter('ticketCustomFields', index, {}) as IDataObject;
	const ticketCustomFields: IDataObject = {};
	
	if (ticketCustomFieldsData.fields && Array.isArray(ticketCustomFieldsData.fields)) {
		for (const field of ticketCustomFieldsData.fields as Array<{name: string; value: string}>) {
			if (field.name && field.value) {
				const fieldName = field.name.startsWith('service_') ? field.name : `service_${field.name}`;
				ticketCustomFields[fieldName] = field.value;
			}
		}
	}

	// Process block custom fields (custom_ prefix)
	const blockCustomFieldsData = this.getNodeParameter('blockCustomFields', index, {}) as IDataObject;
	const blockCustomFields: IDataObject = {};
	
	if (blockCustomFieldsData.fields && Array.isArray(blockCustomFieldsData.fields)) {
		for (const field of blockCustomFieldsData.fields as Array<{name: string; value: string}>) {
			if (field.name && field.value) {
				const fieldName = field.name.startsWith('custom_') ? field.name : `custom_${field.name}`;
				blockCustomFields[fieldName] = field.value;
			}
		}
	}

	const body: IDataObject = cleanBody({
		ticket_id: ticketId,
		username,
		...additionalFields,
		...ticketCustomFields,
		...blockCustomFields,
	});

	const response = await serviceManagementApiRequest.call(this, 'POST', '/ticket/execute', body);

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
