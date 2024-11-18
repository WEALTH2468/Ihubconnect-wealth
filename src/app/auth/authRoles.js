/**
 * Authorization Roles
 */
const authRoles = {
    admin: ['admin'],
    teamLead: ['admin', 'team lead'],
    user: ['admin', 'team lead', 'user'],
    onlyGuest: [],
};

export default authRoles;
