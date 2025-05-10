import { Router } from 'express';
import { scrapeData } from '../controllers/scrape.controller.js';

export class ScrapeRouter {
  router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get('/scrape', scrapeData);
  }

  getRouter() {
    return this.router;
  }
}
