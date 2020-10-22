import { Request, Response } from 'express';
import { parseISO } from 'date-fns';
import { container } from 'tsyringe';
import ListAppointmentsService from '@modules/appointments/services/ListAppointmentsService';
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';

export default class AppointmentsController {
  public async index(req: Request, res: Response): Promise<Response> {
    const listAppointments = container.resolve(ListAppointmentsService);

    const appointments = await listAppointments.execute();
    return res.json(appointments);
  }

  public async create(req: Request, res: Response): Promise<Response> {
    const { provider_id, date } = req.body;

    const parsedDate = parseISO(date);

    const createAppointment = container.resolve(CreateAppointmentService);

    const appointment = await createAppointment.execute({
      provider_id,
      date: parsedDate,
    });

    return res.json(appointment);
  }
}
