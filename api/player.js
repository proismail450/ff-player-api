export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed"
    });
  }

  const { uid, region } = req.query;

  if (!uid || !region) {
    return res.status(400).json({
      success: false,
      error: "UID and region are required"
    });
  }

  try {
    const url =
      `${process.env.PLAYER_API_URL}` +
      `?uid=${encodeURIComponent(uid)}` +
      `&region=${encodeURIComponent(region)}`;

    const response = await fetch(url, {
      headers: {
        "Authorization": `Bearer ${process.env.PLAYER_API_KEY}`,
        "Accept": "application/json"
      }
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        error: data?.message || "Player lookup failed"
      });
    }

    const nickname =
      data?.nickname ||
      data?.playerName ||
      data?.basicInfo?.nickname ||
      null;

    if (!nickname) {
      return res.status(404).json({
        success: false,
        error: "Player name unavailable"
      });
    }

    return res.status(200).json({
      success: true,
      uid,
      region,
      nickname
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "API request failed"
    });
  }
}
