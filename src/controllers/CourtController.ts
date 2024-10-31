import { Request, Response } from 'express';
import { AuthRequest, Court } from '../types';
import { courtService } from '../services/CourtService';
import { uploadMiddleware } from '../middleware/upload';

export class CourtController {
  async getAllCourts(req: Request, res: Response) {
    try {
      const courts = await courtService.getAllCourts();
      res.json(courts);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching courts' });
    }
  }

  async getCourtById(req: Request, res: Response) {
    try {
      const court = await courtService.getCourtById(req.params.id);
      if (!court) {
        return res.status(404).json({ message: 'Court not found' });
      }
      res.json(court);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching court' });
    }
  }

  async createCourt(req: AuthRequest, res: Response) {
    try {
      if (req.user?.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized' });
      }

      const courtData: Omit<Court, 'id'> = req.body;
      const court = await courtService.createCourt(courtData);
      res.status(201).json(court);
    } catch (error) {
      res.status(500).json({ message: 'Error creating court' });
    }
  }

  async updateCourt(req: AuthRequest, res: Response) {
    try {
      if (req.user?.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized' });
      }

      const court = await courtService.updateCourt(req.params.id, req.body);
      if (!court) {
        return res.status(404).json({ message: 'Court not found' });
      }
      res.json(court);
    } catch (error) {
      res.status(500).json({ message: 'Error updating court' });
    }
  }

  async deleteCourt(req: AuthRequest, res: Response) {
    try {
      if (req.user?.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized' });
      }

      const success = await courtService.deleteCourt(req.params.id);
      if (!success) {
        return res.status(404).json({ message: 'Court not found' });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Error deleting court' });
    }
  }

  async uploadCourtImage(req: AuthRequest, res: Response) {
    try {
      if (req.user?.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized' });
      }

      const upload = uploadMiddleware.single('image');

      upload(req, res, async (err) => {
        if (err) {
          return res.status(400).json({ message: 'Error uploading image' });
        }

        if (!req.file) {
          return res.status(400).json({ message: 'No image file provided' });
        }

        const imageUrl = `/uploads/${req.file.filename}`;
        const court = await courtService.addCourtImage(req.params.id, imageUrl);

        if (!court) {
          return res.status(404).json({ message: 'Court not found' });
        }

        res.json(court);
      });
    } catch (error) {
      res.status(500).json({ message: 'Error uploading court image' });
    }
  }
}

export const courtController = new CourtController();