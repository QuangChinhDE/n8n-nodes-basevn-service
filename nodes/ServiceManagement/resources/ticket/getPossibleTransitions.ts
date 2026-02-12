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
		displayName: 'Service ID',
		name: 'serviceId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['ticket'],
				operation: ['getPossibleTransitions'],
			},
		},
		description: 'The ID of the service',
	},
	{
		displayName: 'Block ID',
		name: 'blockId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['ticket'],
				operation: ['getPossibleTransitions'],
			},
		},
		description: 'The ID of the block',
	},
	{
		displayName: 'Response Selector',
		name: 'responseSelector',
		type: 'options',
		options: [
			{ name: 'Full Response', value: '' },
			{ name: 'Transitions Array', value: 'transitions' },
		],
		default: '',
		displayOptions: {
			show: {
				resource: ['ticket'],
				operation: ['getPossibleTransitions'],
			},
		},
		description: 'Select which field to return from response. Leave empty for full response.',
	},
];

export async function execute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const serviceId = this.getNodeParameter('serviceId', index) as string;
	const blockId = this.getNodeParameter('blockId', index) as string;
	const selector = this.getNodeParameter('responseSelector', index, '') as string;

	const body: IDataObject = cleanBody({
		service_id: serviceId,
		block_id: blockId,
	});

	const response = await serviceManagementApiRequest.call(this, 'POST', '/service/block/transition/list', body);
	
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
