// Export all services from a single file for easy importing
import authService from './authService.js';
import userService from './userService.js';
import internshipService from './internshipService.js';
import dashboardService from './dashboardService.js';

export {
  authService,
  userService,
  internshipService,
  dashboardService
};

export default {
  authService,
  userService,
  internshipService,
  dashboardService
};

