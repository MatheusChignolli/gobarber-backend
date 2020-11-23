import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListAppointmentsService from './ListAppointmentsService';
import CreateAppointmentService from './CreateAppointmentService';

describe('CreateAppointment', () => {
  it('should be able to list appointments', async () => {
    const fakeAppointmentsRepository = new FakeAppointmentsRepository();
    const createAppointments = new CreateAppointmentService(
      fakeAppointmentsRepository,
    );
    const listAppointments = new ListAppointmentsService(
      fakeAppointmentsRepository,
    );

    await createAppointments.execute({
      date: new Date(2020, 4, 10, 11),
      provider_id: '123456789',
    });

    await createAppointments.execute({
      date: new Date(2020, 5, 10, 11),
      provider_id: '987654321',
    });

    const appointments = await listAppointments.execute();

    expect(appointments?.length).toBe(2);
  });
});
