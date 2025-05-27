import { json } from "@remix-run/node";

export const loader = async () => {
  try {
    // Ensure environment variables exist
    if (
      !process.env.STARWALT_URL ||
      !process.env.STARWALT_USER ||
      !process.env.STARWALT_PASSWORD
    ) {
      throw new Error("Missing required environment variables");
    }

    const credentials = Buffer.from(
      `${process.env.STARWALT_USER}:${process.env.STARWALT_PASSWORD}`
    ).toString("base64");

    const response = await fetch(`${process.env.STARWALT_URL}/api/principal`, {
      method: "GET",
      headers: {
        Authorization: `Basic ${credentials}`,
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return json(data);
  } catch (error) {
    console.error("Error fetching user data:", error);
    return json({ error: "Failed to fetch user data" }, { status: 500 });
  }
};
