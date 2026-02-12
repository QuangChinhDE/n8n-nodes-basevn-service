import type { INodeProperties } from 'n8n-workflow';
import * as createTicket from './createTicket';
import * as updateTicket from './updateTicket';
import * as updateTicketCustomFields from './updateTicketCustomFields';
import * as assignTicket from './assignTicket';
import * as executeTicket from './executeTicket';
import * as moveTicketBack from './moveTicketBack';
import * as moveTicketToBlock from './moveTicketToBlock';
import * as getAllTickets from './getAllTickets';
import * as getTicketDetailsWithBlock from './getTicketDetailsWithBlock';
import * as getTicketActivityLog from './getTicketActivityLog';
import * as getPossibleTransitions from './getPossibleTransitions';

export const description: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['ticket'],
			},
		},
		options: [
			{
				name: 'Assign Ticket',
				value: 'assignTicket',
				action: 'Assign ticket to user',
			},
			{
				name: 'Create Ticket',
				value: 'createTicket',
				action: 'Create a new ticket',
			},
			{
				name: 'Execute Ticket',
				value: 'executeTicket',
				action: 'Execute ticket transition',
			},
			{
				name: 'Get All Tickets',
				value: 'getAllTickets',
				action: 'List all tickets in system',
			},
			{
				name: 'Get Possible Transitions',
				value: 'getPossibleTransitions',
				action: 'Get possible transitions from a block',
			},
			{
				name: 'Get Ticket Activity Log',
				value: 'getTicketActivityLog',
				action: 'Get activity log of ticket',
			},
			{
				name: 'Get Ticket Details with Block',
				value: 'getTicketDetailsWithBlock',
				action: 'Get detail of ticket with block info',
			},
			{
				name: 'Move Ticket Back',
				value: 'moveTicketBack',
				action: 'Move ticket back to previous block',
			},
			{
				name: 'Move Ticket to Block',
				value: 'moveTicketToBlock',
				action: 'Move ticket to specific block',
			},
			{
				name: 'Update Ticket',
				value: 'updateTicket',
				action: 'Update ticket information',
			},
			{
				name: 'Update Ticket Custom Fields',
				value: 'updateTicketCustomFields',
				action: 'Update ticket custom fields',
			},
		],
		default: 'createTicket',
	},
	...createTicket.createTicketDescription,
	...updateTicket.updateTicketDescription,
	...updateTicketCustomFields.updateTicketCustomFieldsDescription,
	...assignTicket.assignTicketDescription,
	...executeTicket.executeTicketDescription,
	...moveTicketBack.moveTicketBackDescription,
	...moveTicketToBlock.moveTicketToBlockDescription,
	...getAllTickets.getAllTicketsDescription,
	...getTicketDetailsWithBlock.getTicketDetailsWithBlockDescription,
	...getTicketActivityLog.getTicketActivityLogDescription,
	...getPossibleTransitions.getPossibleTransitionsDescription,
];

export { 
	createTicket, 
	updateTicket, 
	updateTicketCustomFields, 
	assignTicket, 
	executeTicket, 
	moveTicketBack, 
	moveTicketToBlock, 
	getAllTickets, 
	getTicketDetailsWithBlock, 
	getTicketActivityLog,
	getPossibleTransitions
};
