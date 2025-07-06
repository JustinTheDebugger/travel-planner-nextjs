"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

async function geocodeAddress(address: string) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY!;
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${apiKey}`
  );

  //   if (!response.ok) return null;

  const data = await response.json();
  //   if (!data.results || data.results.length === 0) return null;

  const { lat, lng } = data.results[0].geometry.location;
  return { lat, lng };
}

export async function addLocation(formData: FormData, tripId: string) {
  const session = await auth();
  if (!session) {
    throw new Error("Not authenticated");
  }

  const address = formData.get("address")?.toString();
  if (!address) {
    throw new Error("Missing address");
  }

  //   const coords = await geocodeAddress(address);
  //   const lat = coords?.lat ?? null;
  //   const lng = coords?.lng ?? null;

  const dummyAddress = "Test Location";
  const dummyLat = 1.23;
  const dummyLng = 4.56;

  const count = await prisma.location.count({
    where: { tripId },
  });

  await prisma.location.create({
    data: {
      locationTitle: dummyAddress,
      lat: dummyLat,
      lng: dummyLng,
      tripId,
      order: count,
    },
  });

  redirect(`/trips/${tripId}`);
}
