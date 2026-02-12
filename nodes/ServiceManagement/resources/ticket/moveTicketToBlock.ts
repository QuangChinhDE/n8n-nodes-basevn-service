import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';
import { serviceManagementApiRequest } from '../../shared/transport';
import { cleanBody, processResponse } from '../../shared/utils';

export const moveTicketToBlockDescription: INodeProperties[] = [
	{
		displayName: 'Ticket ID',
		name: 'ticketId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['ticket'],
				operation: ['moveTicketToBlock'],
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
				operation: ['moveTicketToBlock'],
			},
		},
		description: 'Người dùng có thể chỉnh sửa người theo dõi khối của phiếu',
	},
	{
		displayName: 'Next Block ID',
		name: 'nextBlockId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['ticket'],
				operation: ['moveTicketToBlock'],
			},
		},
		description: 'ID khối kế tiếp muốn chuyển đến (TH rẽ nhánh)',
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
				operation: ['moveTicketToBlock'],
			},
		},
		options: [
			{
				displayName: 'Assignees',
				name: 'assignees',
				type: 'string',
				default: '',
				description: 'Người thực thi khối kế tiếp (phải điền nếu chọn người thực thi hoặc trong danh sách cài cố định)',
			},
			{
				displayName: 'Current Ticket Block ID',
				name: 'current_ticket_block_id',
				type: 'string',
				default: '',
				description: 'ID khối hiện tại của phiếu (để trống sẽ tự động xác định khối luồng chính)',
			},
			{
				displayName: 'Managers',
				name: 'managers',
				type: 'string',
				default: '',
				description: 'Dùng cho khối duyệt (trong TH bật yêu cầu thêm QLTT)',
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
	const nextBlockId = this.getNodeParameter('nextBlockId', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

	const body: IDataObject = cleanBody({
		ticket_id: ticketId,
		username,
		next_block_id: nextBlockId,
		...additionalFields,
	});

	const response = await serviceManagementApiRequest.call(this, 'POST', '/ticket/move.to.block', body);

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
