import type { INodeProperties } from 'n8n-workflow';
import * as getAllServices from './getAllServices';
import * as getAllCompounds from './getAllCompounds';
import * as getAllGroups from './getAllGroups';
import * as getServiceBlocks from './getServiceBlocks';

export const description: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['service'],
			},
		},
		options: [
			{
				name: 'Get All Services',
				value: 'getAllServices',
				action: 'Get all services',
			},
			{
				name: 'Get All Compounds',
				value: 'getAllCompounds',
				action: 'Get all compounds of a service',
			},
			{
				name: 'Get All Groups',
				value: 'getAllGroups',
				action: 'Get all groups of a service',
			},
			{
				name: 'Get Service Blocks',
				value: 'getServiceBlocks',
				action: 'Get all blocks of a service',
			},
		],
		default: 'getAllServices',
	},
	...getAllServices.getAllServicesDescription,
	...getAllCompounds.getAllCompoundsDescription,
	...getAllGroups.getAllGroupsDescription,
	...getServiceBlocks.getServiceBlocksDescription,
];

export { getAllServices, getAllCompounds, getAllGroups, getServiceBlocks };
