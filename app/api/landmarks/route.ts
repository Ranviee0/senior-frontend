import { NextResponse } from "next/server"

// Define the landmark data type
interface Landmark {
  id: number
  name: string
  type: string
  latitude: number
  longitude: number
}

// This is a placeholder API route that would be replaced with your actual backend integration
export async function GET() {
  // In a real application, this data would come from a database or external API
  const landmarks: Landmark[] = [
    {
      name: "BTS เคหะฯ",
      longitude: 100.6076939,
      type: "Train Station",
      id: 1,
      latitude: 13.5676866,
    },
    {
      name: "BTS แยกคปอ.",
      longitude: 100.6258647,
      type: "Train Station",
      id: 2,
      latitude: 13.92502,
    },
    {
      name: "BTS ห้าแยกลาดพร้าว",
      longitude: 100.5620832,
      type: "Train Station",
      id: 3,
      latitude: 13.8166739,
    },
    // You can add more sample landmarks here
  ]

  return NextResponse.json(landmarks)
}

