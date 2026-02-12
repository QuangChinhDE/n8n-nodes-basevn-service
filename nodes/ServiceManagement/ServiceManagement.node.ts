import {
	NodeConnectionTypes,
	type IExecuteFunctions,
	type INodeExecutionData,
	type INodeType,
	type INodeTypeDescription,
} from 'n8n-workflow';

import * as service from './resources/service';
import * as ticket from './resources/ticket';

export class ServiceManagement implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'BaseVN - App Service',
		name: 'serviceManagement',
		icon: 'file:../../icons/service.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with BaseVN - App Service',
		defaults: {
			name: 'BaseVN - App Service',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'serviceManagementApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Service',
						value: 'service',
					},
					{
						name: 'Ticket',
						value: 'ticket',
					},
				],
				default: 'service',
			},
			...service.description,
			...ticket.description,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData: INodeExecutionData[] = [];

				if (resource === 'service') {
					const operation = this.getNodeParameter('operation', i) as string;
					
					if (operation === 'getAllServices') {
						responseData = await service.getAllServices.execute.call(this, i);
					} else if (operation === 'getAllCompounds') {
						responseData = await service.getAllCompounds.execute.call(this, i);
					} else if (operation === 'getAllGroups') {
						responseData = await service.getAllGroups.execute.call(this, i);
					} else if (operation === 'getServiceBlocks') {
						responseData = await service.getServiceBlocks.execute.call(this, i);
					}
				} else if (resource === 'ticket') {
					const operation = this.getNodeParameter('operation', i) as string;
					
					if (operation === 'createTicket') {
						responseData = await ticket.createTicket.execute.call(this, i);
					} else if (operation === 'updateTicket') {
						responseData = await ticket.updateTicket.execute.call(this, i);
					} else if (operation === 'updateTicketCustomFields') {
						responseData = await ticket.updateTicketCustomFields.execute.call(this, i);
					} else if (operation === 'assignTicket') {
						responseData = await ticket.assignTicket.execute.call(this, i);
					} else if (operation === 'executeTicket') {
						responseData = await ticket.executeTicket.execute.call(this, i);
					} else if (operation === 'moveTicketBack') {
						responseData = await ticket.moveTicketBack.execute.call(this, i);
					} else if (operation === 'moveTicketToBlock') {
						responseData = await ticket.moveTicketToBlock.execute.call(this, i);
					} else if (operation === 'getAllTickets') {
						responseData = await ticket.getAllTickets.execute.call(this, i);
					} else if (operation === 'getTicketDetailsWithBlock') {
						responseData = await ticket.getTicketDetailsWithBlock.execute.call(this, i);
					} else if (operation === 'getTicketActivityLog') {
						responseData = await ticket.getTicketActivityLog.execute.call(this, i);
					} else if (operation === 'getPossibleTransitions') {
						responseData = await ticket.getPossibleTransitions.execute.call(this, i);
					}
				}

				returnData.push(...responseData);
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: { error: error.message },
						pairedItem: i,
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
