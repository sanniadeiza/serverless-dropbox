import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'serverlessDropboxStorage',
  access: (allow) => ({
    'private/{entity_id}/*': [
      allow.entity('identity').to(['read', 'write', 'delete'])
    ]
  })
});
