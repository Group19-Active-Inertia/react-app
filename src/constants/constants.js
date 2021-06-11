export const ROLES = {
      ADMIN: 'admin',
      SITE_MANAGER: 'sitemanager',
      DEFAULT: 'default'
}

export const ALLOWED_ADD_USER_TYPES = {
      [ROLES.ADMIN]: [ROLES.ADMIN, ROLES.SITE_MANAGER, ROLES.DEFAULT],
      [ROLES.SITE_MANAGER]: [ROLES.DEFAULT],
}


const PERMISSIONS = {
      ADD_USER: 'add_user',
      REMOVE_USER: 'remove_user'      
}

const APPLICABLE_PERMISSIONS = {
      [ROLES.ADMIN]: [
            PERMISSIONS.ADD_USER,
            PERMISSIONS.REMOVE_USER
      ]
}