"use client";
import Container from "@/components/Container";
import Input from "@/components/Input";
import PageTitle from "@/components/PageTitle";
import SectionTitle from "@/components/SectionTitle";
import { useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";
import { getSyncStatus } from "@/services/actions/sync";
export default function Settings() {
  const [lastsync, setLastsync] = useLocalStorage<Date | null | undefined>(
    "lastsync",
    null
  );
  const [syncToken, setSyncToken] = useLocalStorage("syncToken", "");
  const [token, setToken] = useLocalStorage("token", "");
  const lastSyncIsWhinAnHour =
    lastsync &&
    new Date().getTime() - new Date(lastsync).getTime() < 60 * 60 * 1000 * 24;
  const lastsyncStatus = lastsync
    ? lastSyncIsWhinAnHour
      ? "已同步至最新"
      : "最後同步時間：" + new Date(lastsync).toDateString()
    : "從未同步";
  useEffect(() => {
    fetchSyncStatus();
  }, []);
  async function fetchSyncStatus() {
    let res = await getSyncStatus(token);
    if (res.success) {
      setSyncToken(location.origin + "/api/v1/sync/" + res.user!.token);
      setLastsync(res.lastSync);
    }
  }
  return (
    <Container>
      <PageTitle>設定</PageTitle>
      <SectionTitle>同步狀態</SectionTitle>
      <p>{lastsyncStatus}</p>
      <SectionTitle className="mt-2">同步 API 網址</SectionTitle>
      <Input defaultValue={syncToken} readOnly />
      <a
        href="https://www.icloud.com/shortcuts/5f6a00deed514c63bc1498f9e4c3166f"
        target="_blank"
        className="block mt-2 text-blue-500 bg-white p-2 rounded-md text-center"
      >
        安裝同步 iOS 捷徑
      </a>
    </Container>
  );
}