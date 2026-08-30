import { NextResponse } from "next/server";
import { execSync } from "child_process";

export async function GET() {
  try {
    // Run git command to get the last commit date and time formatted nicely
    const gitTime = execSync('git log -1 --format="%cd" --date=format:"%d-%m-%Y %I:%M %p"', { 
      encoding: "utf-8" 
    }).trim();

    return NextResponse.json({ 
      success: true, 
      lastUpdate: gitTime 
    });
  } catch (error) {
    console.warn("Failed to retrieve git info:", error.message || error);
    
    // Fallback to current build / runtime time if git is not available or not a repository
    const now = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    const d = pad(now.getDate());
    const m = pad(now.getMonth() + 1);
    const y = now.getFullYear();
    let hours = now.getHours();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const hr = pad(hours);
    const min = pad(now.getMinutes());
    const fallbackTime = `${d}-${m}-${y} ${hr}:${min} ${ampm}`;

    return NextResponse.json({ 
      success: true, 
      lastUpdate: fallbackTime 
    });
  }
}
