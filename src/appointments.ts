
import prisma from "./lib/prisma.js";

export async function bookAppointment(
  patientId: number,
  doctorId: number,
  date: Date,
  notes?: string
) {
  return await prisma.appointment.create({
    data: {
      appointmentDate: date,
      notes: notes ?? null,
      patient: {
        connect: { id: patientId },
      },
      doctor: {
        connect: { id: doctorId },
      },
    },
    include: {
      patient: {
        select: {
          name: true,
          email: true,
        },
      },
      doctor: {
        select: {
          name: true,
          specialty: true,
        },
      },
    },
  });
}

export async function getAppointmentFull(id: number) {
  const appointment = await prisma.appointment.findUnique({
    where: { id },
    include: {
      patient: true,
      doctor: true,
    },
  });

  if (!appointment) {
    throw new Error("Appointment not found");
  }

  return appointment;
}

export async function getDoctorUpcomingAppointments(doctorId: number) {
  return await prisma.appointment.findMany({
    where: {
      doctorId,
      status: "scheduled",
      appointmentDate: {
        gte: new Date(),
      },
    },
    orderBy: {
      appointmentDate: "asc",
    },
    include: {
      patient: {
        select: {
          name: true,
          phone: true,
        },
      },
    },
  });
}

export async function setAppointmentStatus(
  id: number,
  status: "scheduled" | "completed" | "cancelled"
) {
  return await prisma.appointment.update({
    where: { id },
    data: { status },
  });
}

export async function cancelAllPatientAppointments(patientId: number) {
  return await prisma.appointment.updateMany({
    where: {
      patientId,
      status: "scheduled",
    },
    data: {
      status: "cancelled",
    },
  });
}

export async function deleteAppointment(id: number) {
  return await prisma.appointment.delete({
    where: { id },
  });
}

