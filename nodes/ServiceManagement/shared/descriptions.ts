import type { INodeProperties } from 'n8n-workflow';

/**
 * Common field descriptions used across resources
 */

export const groupIdDescription: INodeProperties = {
	displayName: 'Group ID',
	name: 'groupId',
	type: 'string',
	default: '',
	required: true,
	description: 'The ID of the group',
};

export const requestIdDescription: INodeProperties = {
	displayName: 'Request ID',
	name: 'requestId',
	type: 'string',
	default: '',
	required: true,
	description: 'The ID of the request',
};

export const postIdDescription: INodeProperties = {
	displayName: 'Post HID',
	name: 'postHid',
	type: 'string',
	default: '',
	required: true,
	description: 'The HID of the post (hid field from post object)',
};

export const pageDescription: INodeProperties = {
	displayName: 'Page',
	name: 'page',
	type: 'number',
	default: 0,
	description: 'Page number for pagination (starts from 0)',
};

export const returnAllDescription: INodeProperties = {
	displayName: 'Return All',
	name: 'returnAll',
	type: 'boolean',
	default: false,
	description: 'Whether to return all results or only up to a given limit',
};

// Selector for Group List endpoint
export const groupListSelectorDescription: INodeProperties = {
	displayName: 'Response Selector',
	name: 'responseSelector',
	type: 'options',
	options: [
		{ name: 'Full Response', value: '' },
		{ name: 'Groups Array', value: 'groups' },
	],
	default: '',
	description: 'Select which field to return from response. Leave empty for full response.',
};

// Selector for Group Get endpoint
export const groupGetSelectorDescription: INodeProperties = {
	displayName: 'Response Selector',
	name: 'responseSelector',
	type: 'options',
	options: [
		{ name: 'Full Response', value: '' },
		{ name: 'Group Object', value: 'group' },
	],
	default: '',
	description: 'Select which field to return from response. Leave empty for full response.',
};

// Selector for Request List endpoint
export const requestListSelectorDescription: INodeProperties = {
	displayName: 'Response Selector',
	name: 'responseSelector',
	type: 'options',
	options: [
		{ name: 'Full Response', value: '' },
		{ name: 'Requests Array', value: 'requests' },
	],
	default: '',
	description: 'Select which field to return from response. Leave empty for full response.',
};

// Selector for Request Get endpoint
export const requestGetSelectorDescription: INodeProperties = {
	displayName: 'Response Selector',
	name: 'responseSelector',
	type: 'options',
	options: [
		{ name: 'Approver Followings', value: 'approver_followings' },
		{ name: 'E-Sign Requests', value: 'esign_requests' },
		{ name: 'Extra Approvers', value: 'extra_approvers' },
		{ name: 'Files', value: 'files' },
		{ name: 'Full Response', value: '' },
		{ name: 'Group Object', value: 'group' },
		{ name: 'Request Object', value: 'request' },
	],
	default: '',
	description: 'Select which field to return from response. Leave empty for full response.',
};

// Selector for Request Custom Table endpoint
export const requestCustomTableSelectorDescription: INodeProperties = {
	displayName: 'Response Selector',
	name: 'responseSelector',
	type: 'options',
	options: [
		{ name: 'Custom Table', value: 'custom_table' },
		{ name: 'E-Sign Requests', value: 'esign_requests' },
		{ name: 'Full Response', value: '' },
		{ name: 'Group Object', value: 'group' },
		{ name: 'Request Object', value: 'request' },
	],
	default: '',
	description: 'Select which field to return from response. Leave empty for full response.',
};

// Selector for Post Load endpoint
export const postLoadSelectorDescription: INodeProperties = {
	displayName: 'Response Selector',
	name: 'responseSelector',
	type: 'options',
	options: [
		{ name: 'Full Response', value: '' },
		{ name: 'Posts Array', value: 'posts' },
		{ name: 'Origin Request', value: 'origin' },
	],
	default: '',
	description: 'Select which field to return from response. Leave empty for full response.',
};

// Selector for Comment Load endpoint
export const commentLoadSelectorDescription: INodeProperties = {
	displayName: 'Response Selector',
	name: 'responseSelector',
	type: 'options',
	options: [
		{ name: 'Full Response', value: '' },
		{ name: 'Comments Array', value: 'comments' },
		{ name: 'Origin Post', value: 'origin' },
	],
	default: '',
	displayOptions: {
		show: {
			resource: ['request'],
			operation: ['getComments'],
		},
	},
	description: 'Select which field to return from response. Leave empty for full response.',
};

// Selector for Add Follower endpoint
export const addFollowerSelectorDescription: INodeProperties = {
	displayName: 'Response Selector',
	name: 'responseSelector',
	type: 'options',
	options: [
		{ name: 'Full Response', value: '' },
	],
	default: '',
	displayOptions: {
		show: {
			resource: ['request'],
			operation: ['addFollower'],
		},
	},
	description: 'Select which field to return from response. Leave empty for full response.',
};
