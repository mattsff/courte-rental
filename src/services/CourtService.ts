import { v4 as uuidv4 } from 'uuid';
import { Court } from '../types';

class CourtService {
  private courts: Court[] = [];

  async getAllCourts(): Promise<Court[]> {
    return this.courts;
  }

  async getCourtById(id: string): Promise<Court | undefined> {
    return this.courts.find(court => court.id === id);
  }

  async createCourt(courtData: Omit<Court, 'id'>): Promise<Court> {
    const court: Court = {
      id: uuidv4(),
      ...courtData
    };
    this.courts.push(court);
    return court;
  }

  async updateCourt(id: string, courtData: Partial<Court>): Promise<Court | null> {
    const index = this.courts.findIndex(court => court.id === id);
    if (index === -1) return null;

    const updatedCourt = {
      ...this.courts[index],
      ...courtData,
      id: this.courts[index].id
    };

    this.courts[index] = updatedCourt;
    return updatedCourt;
  }

  async deleteCourt(id: string): Promise<boolean> {
    const index = this.courts.findIndex(court => court.id === id);
    if (index === -1) return false;

    this.courts.splice(index, 1);
    return true;
  }

  async addCourtImage(id: string, imageUrl: string): Promise<Court | null> {
    const court = await this.getCourtById(id);
    if (!court) return null;

    court.images = [...(court.images || []), imageUrl];
    return this.updateCourt(id, court);
  }

  async updateMaintenanceSchedule(
    id: string,
    schedule: MaintenanceSchedule
  ): Promise<Court | null> {
    const court = await this.getCourtById(id);
    if (!court) return null;

    const schedules = [...(court.maintenanceSchedule || [])];
    const scheduleIndex = schedules.findIndex(s => s.id === schedule.id);

    if (scheduleIndex === -1) {
      schedules.push(schedule);
    } else {
      schedules[scheduleIndex] = schedule;
    }

    return this.updateCourt(id, { maintenanceSchedule: schedules });
  }
}

export const courtService = new CourtService();