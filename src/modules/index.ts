
import {
  healthCheckRegistry,
  healthCheckRouter,
} from "./healthCheck/healthCheck.router";
import { authRegistry } from "./auth/auth.route";
import authRoutes from './auth/auth.route'
export const Registries = [
  healthCheckRegistry,
  authRegistry,
];
export const Modules = {
  healthCheckRouter,
  authRoutes,
};
