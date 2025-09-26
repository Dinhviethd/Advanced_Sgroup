
import {
  healthCheckRegistry,
  healthCheckRouter,
} from "./healthCheck/healthCheck.router";
import authRoutes from "./auth/auth.route";
export const Registries = [healthCheckRegistry];

export const Modules = {
  healthCheckRouter,
  authRoutes,
};
