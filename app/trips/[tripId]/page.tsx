import { auth } from "@/auth";
import TripDetailClient from "@/components/TripDetailClient";
import { prisma } from "@/lib/prisma";
import React from "react";

interface TripDetailProps {
  params: Promise<{ tripId: string }>;
}

const TripDetail = async ({ params }: TripDetailProps) => {
  const { tripId } = await params;

  const session = await auth();

  if (!session) {
    return <div> Please sign in.</div>;
  }

  const trip = await prisma.trip.findFirst({
    where: { id: tripId, userId: session.user?.id },
    include: { locations: true },
  });

  console.log(trip);

  if (!trip) {
    return <div> Trip not found.</div>;
  }

  return <TripDetailClient trip={trip} />;
};

export default TripDetail;
