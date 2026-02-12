import type {
	Icon,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class ServiceManagementApi implements ICredentialType {
	name = 'serviceManagementApi';

	displayName = 'BaseVN - App Service API';

	icon: Icon = 'file:../icons/service.svg';

	documentationUrl = 'https://service.{domain}/extapi/v1';

	properties: INodeProperties[] = [
		{
			displayName: 'Domain',
			name: 'domain',
			type: 'string',
			default: '',
			placeholder: 'example.com',
			description: 'Your domain (e.g., example.com)',
			required: true,
		},
		{
			displayName: 'Access Token',
			name: 'accessToken',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			description: 'Access token from Base Account (v2)',
			required: true,
		},
	];

	// Note: authenticate is handled manually in transport.ts
	// to ensure proper form-urlencoded format

	test: ICredentialTestRequest = {
		request: {
			baseURL: '=https://service.{{$credentials.domain}}/extapi/v1',
			url: '/group/list',
			method: 'POST',
			body: {
				access_token_v2: '={{$credentials.accessToken}}',
				page: 0,
			},
		},
	};
}
