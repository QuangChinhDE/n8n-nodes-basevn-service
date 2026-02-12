import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';
import { serviceManagementApiRequest } from '../../shared/transport';
import { cleanBody, processResponse } from '../../shared/utils';

export const getPossibleTransitionsDescription: INodeProperties[] = [
	{
		displayName: 'Ticket ID',
		name: 'ticketId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['ticket'],
				operation: ['getPossibleTransitions'],
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
				operation: ['getPossibleTransitions'],
			},
		},
		description: 'Username người dùng',
	},
	{
		displayName: 'Response Selector',
		name: 'responseSelector',
		type: 'options',
		options: [
			{ name: 'Full Response', value: '' },
			{ name: 'Actions Array', value: 'actions' },
		],
		default: '',
		displayOptions: {
			show: {
				resource: ['ticket'],
				operation: ['getPossibleTransitions'],
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
	const username = this.getNodeParameter('username', index) as string;
	const selector = this.getNodeParameter('responseSelector', index, '') as string;

	const body: IDataObject = cleanBody({
		ticket_id: ticketId,
		username,
	});

	const response = await serviceManagementApiRequest.call(this, 'POST', '/ticket/get.possible.actions', body);
	
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
