import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';
import { serviceManagementApiRequest } from '../../shared/transport';
import { cleanBody, processResponse } from '../../shared/utils';

export const getTicketActivityLogDescription: INodeProperties[] = [
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['ticket'],
				operation: ['getTicketActivityLog'],
			},
		},
		options: [
			{
				displayName: 'Absolute Time',
				name: 'absolute_time',
				type: 'options',
				options: [
					{ name: 'Yes', value: 1 },
					{ name: 'No', value: 0 },
				],
				default: 1,
				description: 'Sử dụng thời gian tuyệt đối',
			},
			{
				displayName: 'Item Per Page',
				name: 'item_per_page',
				type: 'number',
				typeOptions: {
					minValue: 1,
				},
				default: 50,
				description: 'Số lượng kết quả trên mỗi trang',
			},
			{
				displayName: 'Last Update From',
				name: 'last_update_from',
				type: 'number',
				default: '',
				description: 'Timestamp bắt đầu (Unix timestamp)',
			},
			{
				displayName: 'Last Update To',
				name: 'last_update_to',
				type: 'number',
				default: '',
				description: 'Timestamp kết thúc (Unix timestamp)',
			},
		],
	},
	{
		displayName: 'Response Selector',
		name: 'responseSelector',
		type: 'options',
		options: [
			{ name: 'Full Response', value: '' },
			{ name: 'Activity Log Array', value: 'activity_log' },
		],
		default: '',
		displayOptions: {
			show: {
				resource: ['ticket'],
				operation: ['getTicketActivityLog'],
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
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;
	const selector = this.getNodeParameter('responseSelector', index, '') as string;

	const body: IDataObject = cleanBody({
		...additionalFields,
	});

	const response = await serviceManagementApiRequest.call(this, 'POST', '/ticket/get.activity.logs', body);
	
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
