import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';
import { serviceManagementApiRequest } from '../../shared/transport';
import { cleanBody, processResponse } from '../../shared/utils';

export const getTicketDetailsWithBlockDescription: INodeProperties[] = [
	{
		displayName: 'Ticket ID',
		name: 'ticketId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['ticket'],
				operation: ['getTicketDetailsWithBlock'],
			},
		},
		description: 'ID của khối phiếu',
	},
	{
		displayName: 'Response Selector',
		name: 'responseSelector',
		type: 'options',
		options: [
			{ name: 'Full Response', value: '' },
			{ name: 'Ticket Object', value: 'ticket' },
			{ name: 'Block Object', value: 'block' },
		],
		default: '',
		displayOptions: {
			show: {
				resource: ['ticket'],
				operation: ['getTicketDetailsWithBlock'],
			},
		},
		description: 'Chọn trường dữ liệu trả về. Để trống nếu muốn toàn bộ response.',
	},
];

export async function execute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	const ticketId = this.getNodeParameter('ticketId', index) as string;
	const selector = this.getNodeParameter('responseSelector', index, '') as string;

	const body: IDataObject = cleanBody({
		id: ticketId,
	});

	const response = await serviceManagementApiRequest.call(this, 'POST', '/ticket/get.detail', body);
	
	if (response.code === 1) {
		const result = processResponse(response, selector);
		
		if (Array.isArray(result)) {
			result.forEach((item) => {
				returnData.push({
					json: item as IDataObject,
					pairedItem: index,
				});
			});
		} else {
			returnData.push({
				json: result,
				pairedItem: index,
			});
		}
	} else {
		throw new Error(`API Error: ${response.message || 'Unknown error'}`);
	}

	return returnData;
}
