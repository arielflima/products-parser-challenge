import { Router } from 'express';
import { apiInfo } from '../infra/apiInfo';

const router = Router();

// GET
router.get('/', apiInfo);

export default router;
