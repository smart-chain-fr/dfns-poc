import { apiKeyToken } from "./constants";
import { makeHttpRequest } from "./makeHttpRequest";
import { getRequest } from "./sendApiRequest";
import { signRequestWithApiKey } from "./signRequestWithApiKey";

type Permission = {
  id: string;
  orgId: string;
  name: string;
  operations: string[];
  resourceId: string;
  status: string;
  predicateIds: string[];
  isImmutable: boolean;
  dateCreated: string;
  dateUpdated: string;
  isArchived: boolean;
};

type PermissionList = {
  items: Permission[];
};

type CreatePermissionInput = {
  name: string;
  operations: string[];
};

type CreatePermissionAssignmentInput = {
  permissionId: string;
  identityId: string;
  identityKind: string;
};

const createPermission = async (name: string) : Promise<Permission> => {
  const payload: CreatePermissionInput = {
    name,
    operations: [
      "AssetAccounts:Archive",
      "AssetAccounts:Create",
      "AssetAccounts:Read",
      "Auth:Action:Sign",
      "Balances:Read",
      "Payments:Create",
      "Payments:Read",
      "PublicKeyAddresses:Read",
      "PublicKeys:Create",
      "PublicKeys:Read",
      "Signatures:Create",
      "Signatures:Read",
      "Transactions:Create",
      "Transactions:Read",
    ]
  };

  const request = {
    method: "POST",
    path: "/permissions",
    payload: JSON.stringify(payload),
  };

  const userActionSignature = await signRequestWithApiKey(
    request.method,
    request.path,
    request.payload
  );
  return await makeHttpRequest<Permission>(
    request.method,
    request.path,
    request.payload,
    apiKeyToken,
    userActionSignature
  );
}

export const assignPermissionsToUser = async (userId: string) : Promise<boolean> => {
  const name = 'DfnsDemoAppUserPermissions'
  console.log('Get permissions list')
  const permissions = await getRequest<{}, PermissionList>(
    '/permissions',
    {},
    apiKeyToken
  );

  let permission = permissions.items.find((perm) => perm.name === name)
  if (!permission || permission.status !== 'Active') {
    console.log('Creating new permission')
    permission = await createPermission(name)
  }

  console.log('Assigning permission to user')
  const payload: CreatePermissionAssignmentInput = {
    permissionId: permission.id,
    identityId: userId,
    identityKind: 'CustomerEmployee',
  }

  const request = {
    method: "POST",
    path: "/permissions/assignments",
    payload: JSON.stringify(payload),
  };

  const userActionSignature = await signRequestWithApiKey(
    request.method,
    request.path,
    request.payload
  );
  await makeHttpRequest<{}>(
    request.method,
    request.path,
    request.payload,
    apiKeyToken,
    userActionSignature
  );
  return true
}
