import { getUserBySyncToken } from "@/services/actions/auth";
import prisma from "@/services/prisma";
export async function POST(request: Request) {
  const id = request.url.split("/").pop();
  const user = await getUserBySyncToken(id!);
  if (!user) {
    return new Response(
      JSON.stringify({ success: false, message: "無效的 token" }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  }
  const data = (await request.json()) as {
    time: string[];
    step: string[];
    distance: string[];
    energy: string[];
  };

  for (let i = 0; i < data.time.length; i++) {
    let time = new Date(data.time[i]);
    // set minutes and seconds to 0
    time.setMinutes(0, 0, 0);
    await prisma.record.upsert({
      where: { userId_timestamp: { userId: user.id, timestamp: time } },
      create: {
        timestamp: time,
        steps: parseInt(data.step[i]),
        distance: parseFloat(data.distance[i]),
        energy: parseFloat(data.energy[i]),
        userId: user.id,
      },
      update: {
        steps: parseInt(data.step[i]),
        distance: parseFloat(data.distance[i]),
        energy: parseFloat(data.energy[i]),
      },
    });
  }
  if (data.time.length > 0) {
    return new Response(`${user.name}，已同步 ${data.time.length} 筆資料`, {
      headers: { "Content-Type": "application/json" },
    });
  } else {
    return new Response(
      `${user.name}，沒有接受到任何健康資料，請檢查來源是否正確`,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}