
import prisma from "./lib/prisma.js";

async function main() {
  // Clear existing data in dependency order
  await prisma.appointment.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.doctor.deleteMany();

  // Create doctors
  const doctor1 = await prisma.doctor.create({
    data: {
      name: "Dr Priya Sharma",
      specialty: "Cardiology",
      email: "priya.sharma@hospital.io",
    },
  });

  const doctor2 = await prisma.doctor.create({
    data: {
      name: "Dr Vikram Rao",
      specialty: "Neurology",
      email: "vikram.rao@hospital.io",
    },
  });

  // Create patients
  const patient1 = await prisma.patient.create({
    data: {
      name: "Aditi Mehra",
      email: "aditi@example.com",
      phone: "9876543210",
      dateOfBirth: new Date("1990-04-12"),
    },
  });

  const patient2 = await prisma.patient.create({
    data: {
      name: "Rahul Singh",
      email: "rahul@example.com",
    },
  });

  // Create appointments
  await prisma.appointment.create({
    data: {
      appointmentDate: new Date("2024-08-15T10:00:00"),
      status: "scheduled",
      patient: { connect: { id: patient1.id } },
      doctor: { connect: { id: doctor1.id } },
    },
  });

  await prisma.appointment.create({
    data: {
      appointmentDate: new Date("2024-08-16T11:00:00"),
      status: "scheduled",
      patient: { connect: { id: patient2.id } },
      doctor: { connect: { id: doctor2.id } },
    },
  });

  console.log("Seed data created successfully!");
  console.log("Doctors: 2");
  console.log("Patients: 2");
  console.log("Appointments: 2");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

