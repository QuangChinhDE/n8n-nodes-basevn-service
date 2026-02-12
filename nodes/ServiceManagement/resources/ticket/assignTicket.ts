import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';
import { serviceManagementApiRequest } from '../../shared/transport';
import { cleanBody, processResponse } from '../../shared/utils';

export const assignTicketDescription: INodeProperties[] = [
	{
		displayName: 'Ticket ID',
		name: 'ticketId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['ticket'],
				operation: ['assignTicket'],
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
				operation: ['assignTicket'],
			},
		},
		description: 'Người thực thi của khối hiện tại đang có quyền giao việc',
	},
	{
		displayName: 'Assignees',
		name: 'assignees',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['ticket'],
				operation: ['assignTicket'],
			},
		},
		description: 'Người thực thi phiếu tại khối được gán (có thể nhiều người, cách nhau bằng dấu phẩy)',
	},
];

export async function execute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	const ticketId = this.getNodeParameter('ticketId', index) as string;
	const username = this.getNodeParameter('username', index) as string;
	const assignees = this.getNodeParameter('assignees', index) as string;

	const body: IDataObject = cleanBody({
		ticket_id: ticketId,
		username,
		assignees,
	});

	const response = await serviceManagementApiRequest.call(this, 'POST', '/ticket/assign', body);

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
