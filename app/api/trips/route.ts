import { auth } from "@/auth";
import { getCountryFromCoordinates } from "@/lib/actions/geocode";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/* ------------------------------------------------------------------
   1.  Demo payload (add / remove rows as you like)
   ------------------------------------------------------------------ */
const demoLocations = [
  // ••• JAPAN •••
  {
    name: "Japan Spring 2024 – Tokyo, Japan",
    lat: 35.6764,
    lng: 139.65,
    country: "Japan",
  },
  {
    name: "Japan Spring 2024 – Osaka, Japan",
    lat: 34.6937,
    lng: 135.5023,
    country: "Japan",
  },

  // ••• AUSTRALIA •••
  {
    name: "Australia Road‑trip 2023 – Sydney, Australia",
    lat: -33.8688,
    lng: 151.2093,
    country: "Australia",
  },
  {
    name: "Australia Road‑trip 2023 – Melbourne, Australia",
    lat: -37.8136,
    lng: 144.9631,
    country: "Australia",
  },

  // ••• UNITED STATES •••
  {
    name: "USA Adventure 2022 – New York City, USA",
    lat: 40.7128,
    lng: -74.006,
    country: "United States",
  },
  {
    name: "USA Adventure 2022 – San Francisco, USA",
    lat: 37.7749,
    lng: -122.4194,
    country: "United States",
  },

  // ••• ITALY •••
  {
    name: "Italy Summer 2021 – Rome, Italy",
    lat: 41.9028,
    lng: 12.4964,
    country: "Italy",
  },
  {
    name: "Italy Summer 2021 – Venice, Italy",
    lat: 45.4408,
    lng: 12.3155,
    country: "Italy",
  },
  {
    name: "Italy Summer 2021 – Venice, Italy",
    lat: 45.4408,
    lng: 12.3155,
    country: "Italy",
  },
];

export async function GET() {
  /* quick escape hatch for demo mode
     ‑ set USE_DEMO_LOCATIONS=true in your .env.local (or CI env)
     ‑ remember to restart dev server after changing env vars       */
  if (process.env.USE_DEMO_LOCATIONS === "true") {
    return NextResponse.json(demoLocations);
  }

  try {
    const session = await auth();
    if (!session) {
      return new NextResponse("Not authenticated", { status: 401 });
    }

    const locations = await prisma.location.findMany({
      where: {
        trip: {
          userId: session.user?.id,
        },
      },
      select: {
        locationTitle: true,
        lat: true,
        lng: true,
        trip: {
          select: {
            title: true,
          },
        },
      },
    });

    const transformedLocations = await Promise.all(
      locations.map(async (loc) => {
        const geocodeResult = await getCountryFromCoordinates(loc.lat, loc.lng);

        return {
          name: `${loc.trip.title} - ${geocodeResult.formattedAddress}`,
          lat: loc.lat,
          lng: loc.lng,
          country: geocodeResult.country,
        };
      })
    );

    return NextResponse.json(transformedLocations);
  } catch (err) {
    console.log(err);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
