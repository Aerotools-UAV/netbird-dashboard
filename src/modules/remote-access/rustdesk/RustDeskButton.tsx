import Button from "@components/Button";
import { DropdownMenuItem } from "@components/DropdownMenu";
import FullTooltip from "@components/FullTooltip";
import { getOperatingSystem } from "@hooks/useOperatingSystem";
import { CircleHelpIcon, MonitorSmartphoneIcon } from "lucide-react";
import * as React from "react";
import { usePermissions } from "@/contexts/PermissionsProvider";
import { OperatingSystem } from "@/interfaces/OperatingSystem";
import { Peer } from "@/interfaces/Peer";

type Props = {
  peer: Peer;
  isDropdown?: boolean;
};

const RUSTDESK_PORT = 21118;

export const RustDeskButton = ({ peer, isDropdown = false }: Props) => {
  const { permission } = usePermissions();

  const os = getOperatingSystem(peer?.os);
  if (os === OperatingSystem.IOS || os === OperatingSystem.ANDROID) {
    return null;
  }

  const disabled = !peer.connected || !permission.peers.update;
  const hasPermission = permission.peers.update;

  const openRustDesk = () => {
    window.location.href = `rustdesk://${peer.ip}:${RUSTDESK_PORT}`;
  };

  return (
    <div>
      <FullTooltip
        className={"w-full"}
        side={isDropdown ? "left" : "top"}
        content={
          <div className={"max-w-xs text-xs flex flex-col gap-2"}>
            {!peer.connected ? (
              <div>Peer offline</div>
            ) : hasPermission ? (
              <div>
                Abre RustDesk (debe estar instalado) contra la IP Netbird del
                peer, puerto {RUSTDESK_PORT} (conexión directa).
              </div>
            ) : (
              <div>
                You do not have permission to launch a RustDesk session. Please
                contact your administrator.
              </div>
            )}
          </div>
        }
        disabled={!disabled}
      >
        {isDropdown ? (
          <DropdownMenuItem
            onClick={openRustDesk}
            disabled={disabled}
            className={"w-full"}
          >
            <div className={"flex gap-3 items-center w-full"}>
              <MonitorSmartphoneIcon size={14} className={"shrink-0"} />
              RustDesk
            </div>
          </DropdownMenuItem>
        ) : (
          <Button
            variant="secondary"
            size="sm"
            onClick={openRustDesk}
            disabled={disabled}
          >
            <MonitorSmartphoneIcon size={16} />
            RustDesk
            {disabled && <CircleHelpIcon size={12} />}
          </Button>
        )}
      </FullTooltip>
    </div>
  );
};
