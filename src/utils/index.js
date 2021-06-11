import { ROLES } from '../constants/constants';

export const getDuration = (x) => {
      const duration = Number(x.duration.substring(x.duration.indexOf('.') + 1));
      return duration / 1000;
}

const includes = (sites, userSites) => {
      return sites.some(site => userSites.includes(site));
}

export const enableRemoveOption = (user, sites) => {
      return user.userType === ROLES.ADMIN ||
            (user.userType === ROLES.SITE_MANAGER && includes(sites, user.sites));
}