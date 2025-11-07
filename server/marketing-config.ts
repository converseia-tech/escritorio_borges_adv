import { Router } from "express";
import fs from "fs/promises";
import path from "path";

const router = Router();

router.post("/save-marketing-config", async (req, res) => {
  try {
    const { metaPixelId, ga4MeasurementId, apiAuthKey } = req.body;

    console.log("[Marketing Config] Saving configuration...");

    // Path to .env file
    const envPath = path.resolve(process.cwd(), ".env");

    // Read current .env content
    let envContent = "";
    try {
      envContent = await fs.readFile(envPath, "utf-8");
    } catch (error) {
      console.log("[Marketing Config] .env file not found, creating new one");
      envContent = "";
    }

    // Update or add Meta Pixel ID
    if (metaPixelId) {
      if (envContent.includes("VITE_META_PIXEL_ID=")) {
        envContent = envContent.replace(
          /VITE_META_PIXEL_ID=.*/,
          `VITE_META_PIXEL_ID=${metaPixelId}`
        );
      } else {
        envContent += `\nVITE_META_PIXEL_ID=${metaPixelId}`;
      }
    }

    // Update or add GA4 Measurement ID
    if (ga4MeasurementId) {
      if (envContent.includes("VITE_GA4_MEASUREMENT_ID=")) {
        envContent = envContent.replace(
          /VITE_GA4_MEASUREMENT_ID=.*/,
          `VITE_GA4_MEASUREMENT_ID=${ga4MeasurementId}`
        );
      } else {
        envContent += `\nVITE_GA4_MEASUREMENT_ID=${ga4MeasurementId}`;
      }
    }

    // Update or add API Auth Key
    if (apiAuthKey) {
      if (envContent.includes("API_AUTH_KEY=")) {
        envContent = envContent.replace(
          /API_AUTH_KEY=.*/,
          `API_AUTH_KEY=${apiAuthKey}`
        );
      } else {
        envContent += `\nAPI_AUTH_KEY=${apiAuthKey}`;
      }
    }

    // Write updated content back to .env
    await fs.writeFile(envPath, envContent.trim() + "\n", "utf-8");

    console.log("[Marketing Config] Configuration saved successfully");
    console.log("[Marketing Config] Meta Pixel ID:", metaPixelId || "not changed");
    console.log("[Marketing Config] GA4 Measurement ID:", ga4MeasurementId || "not changed");
    console.log("[Marketing Config] API Auth Key:", apiAuthKey ? "updated" : "not changed");

    res.json({
      success: true,
      message: "Marketing configuration saved successfully. Please restart the server.",
    });
  } catch (error) {
    console.error("[Marketing Config] Error saving configuration:", error);
    res.status(500).json({
      success: false,
      message: `Failed to save configuration: ${(error as Error).message}`,
    });
  }
});

export default router;
