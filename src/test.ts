
import prisma from "./lib/prisma.js";
import {
  createPatient,
  getPatient,
  searchPatients,
  updatePatientPhone,
  deletePatient,
} from "./patients.js";
import {
  createDoctor,
  listDoctorsBySpecialty,
  deleteDoctor,
} from "./doctors.js";
import {
  bookAppointment,
  getAppointmentFull,
  getDoctorUpcomingAppointments,
  setAppointmentStatus,
  deleteAppointment,
} from "./appointments.js";

async function main() {
  // Create and retrieve a patient
  const patient = await createPatient({
    name: "Test Patient",
    email: "test@example.com",
    phone: "9999999999",
  });
  console.log("Created patient:", patient);

  const foundPatient = await getPatient(patient.id);
  console.log("Found patient:", foundPatient.name);

  // Update and search patient
  await updatePatientPhone(patient.id, "8888888888");
  const searched = await searchPatients("Test");
  console.log("Search results:", searched.length);

  // Create and list a doctor
  const doctor = await createDoctor({
    name: "Dr Test",
    specialty: "General",
    email: "test.doctor@hospital.io",
  });
  console.log("Created doctor:", doctor.name);

  const doctors = await listDoctorsBySpecialty("General");
  console.log("General doctors:", doctors.length);

  // Book an appointment
  const appointment = await bookAppointment(
    patient.id,
    doctor.id,
    new Date("2026-11-01T10:00:00"),
    "Routine checkup"
  );
  console.log("Booked appointment:", appointment.id);

  // Get full appointment details
  const fullAppointment = await getAppointmentFull(appointment.id);
  console.log("Patient:", fullAppointment.patient.name);
  console.log("Doctor:", fullAppointment.doctor.name);

  // Get upcoming appointments
  const upcoming = await getDoctorUpcomingAppointments(doctor.id);
  console.log("Upcoming appointments:", upcoming.length);

  // Update appointment status
  await setAppointmentStatus(appointment.id, "cancelled");
  console.log("Appointment cancelled");

  // Delete test records
  await deleteAppointment(appointment.id);
  await deletePatient(patient.id);
  await deleteDoctor(doctor.id);
  console.log("Test records deleted successfully");
}

main()
  .catch((error) => {
    console.error("Test failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

