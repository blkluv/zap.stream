import "./live-chat.css";
import {
  EventKind,
  NostrPrefix,
  NostrLink,
  ParsedZap,
  parseZap,
  encodeTLV,
} from "@snort/system";
import { useEffect, useMemo } from "react";

import { System } from "../index";
import { useLiveChatFeed } from "../hooks/live-chat";
import { Profile } from "./profile";
import { Icon } from "./icon";
import Spinner from "./spinner";
import { useLogin } from "../hooks/login";
import { formatSats } from "../number";
import useTopZappers from "../hooks/top-zappers";
import { LIVE_STREAM_CHAT } from "../const";
import useEventFeed from "../hooks/event-feed";
import { ChatMessage } from "./chat-message";
import { WriteMessage } from "./write-message";
import { findTag, getHost } from "utils";

export interface LiveChatOptions {
  canWrite?: boolean;
  showHeader?: boolean;
}

function TopZappers({ zaps }: { zaps: ParsedZap[] }) {
  const zappers = useTopZappers(zaps).slice(0, 3);

  return (
    <>
      <h3>Top zappers</h3>
      <div className="top-zappers-container">
        {zappers.map(({ pubkey, total }, idx) => {
          return (
            <div className="top-zapper" key={pubkey}>
              {pubkey === "anon" ? (
                <p className="top-zapper-name">Anon</p>
              ) : (
                <Profile pubkey={pubkey} options={{ showName: false }} />
              )}
              <Icon name="zap-filled" className="zap-icon" />
              <p className="top-zapper-amount">{formatSats(total)}</p>
            </div>
          );
        })}
      </div>
    </>
  );
}

export function LiveChat({
  link,
  options,
  height,
}: {
  link: NostrLink;
  options?: LiveChatOptions;
  height?: number;
}) {
  const feed = useLiveChatFeed(link);
  const login = useLogin();
  useEffect(() => {
    const pubkeys = [
      ...new Set(feed.zaps.flatMap((a) => [a.pubkey, findTag(a, "p")!])),
    ];
    System.ProfileLoader.TrackMetadata(pubkeys);
    return () => System.ProfileLoader.UntrackMetadata(pubkeys);
  }, [feed.zaps]);

  const zaps = feed.zaps
    .map((ev) => parseZap(ev, System.ProfileLoader.Cache))
    .filter((z) => z && z.valid);
  const events = useMemo(() => {
    return [...feed.messages, ...feed.zaps].sort(
      (a, b) => b.created_at - a.created_at
    );
  }, [feed.messages, feed.zaps]);
  const { data: ev } = useEventFeed(link, true);
  const streamer = getHost(ev);
  const naddr = useMemo(() => {
    return encodeTLV(
      NostrPrefix.Address,
      link.id,
      undefined,
      link.kind,
      link.author
    );
  }, [link]);

  return (
    <div className="live-chat" style={height ? { height: `${height}px` } : {}}>
      {(options?.showHeader ?? true) && (
        <div className="header">
          <h2 className="title">Stream Chat</h2>
          <a
            href={`/chat/${naddr}`}
            className="popout-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon name="link" size={32} />
          </a>
        </div>
      )}
      {zaps.length > 0 && (
        <div className="top-zappers">
          <TopZappers zaps={zaps} />
        </div>
      )}
      <div className="messages">
        {events.map((a) => {
          switch (a.kind) {
            case LIVE_STREAM_CHAT: {
              return (
                <ChatMessage
                  streamer={streamer}
                  ev={a}
                  key={a.id}
                  reactions={feed.reactions}
                />
              );
            }
            case EventKind.ZapReceipt: {
              const zap = zaps.find(
                (b) => b.id === a.id && b.receiver === streamer
              );
              if (zap) {
                return <ChatZap zap={zap} key={a.id} />;
              }
            }
          }
          return null;
        })}
        {feed.messages.length === 0 && <Spinner />}
      </div>
      {(options?.canWrite ?? true) && (
        <div className="write-message">
          {login ? (
            <WriteMessage link={link} />
          ) : (
            <p>Please login to write messages!</p>
          )}
        </div>
      )}
    </div>
  );
}

function ChatZap({ zap }: { zap: ParsedZap }) {
  if (!zap.valid) {
    return null;
  }
  const isBig = zap.amount >= 10_000;

  return (
    <div className={`zap-container ${isBig ? "big-zap" : ""}`}>
      <div className="zap">
        <Icon name="zap-filled" className="zap-icon" />
        <Profile
          pubkey={zap.anonZap ? "anon" : zap.sender ?? "anon"}
          options={{
            showAvatar: !zap.anonZap,
            overrideName: zap.anonZap ? "Anon" : undefined,
          }}
        />
        zapped
        <span className="zap-amount">{formatSats(zap.amount)}</span>
        sats
      </div>
      {zap.content && <div className="zap-content">{zap.content}</div>}
    </div>
  );
}
