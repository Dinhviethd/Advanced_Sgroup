
import {
  healthCheckRegistry,
  healthCheckRouter,
} from "./healthCheck/healthCheck.router";

export const Registries = [healthCheckRegistry];

export const Modules = {
  healthCheckRouter,
};
