import { Router } from 'express';

export function createRouter(options = {}): Router {
  return Router(options);
}
