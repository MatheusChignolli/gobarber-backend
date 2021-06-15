import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListAppointmentsService from './ListAppointmentsService';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to list appointments', async () => {
    const listAppointments = new ListAppointmentsService(
      fakeAppointmentsRepository,
    );

    await createAppointment.execute({
      date: new Date(2020, 4, 10, 11),
      provider_id: '123456789',
    });

    await createAppointment.execute({
      date: new Date(2020, 5, 10, 11),
      provider_id: '987654321',
    });

    const appointments = await listAppointments.execute();

    expect(appointments?.length).toBe(2);
  });
});
