import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";
import {
  Add01Icon,
  AiLockIcon,
  AiMailIcon,
  AiMicIcon,
  AlertCircleIcon,
  AudioWave01Icon,
  Calendar03Icon,
  Copy01Icon,
  DashboardSquare01Icon,
  Delete02Icon,
  FileAudioIcon,
  FileUploadIcon,
  FolderOpenIcon,
  Home05Icon,
  Login03Icon,
  Logout03Icon,
  Moon02Icon,
  MoreHorizontalIcon,
  Refresh03Icon,
  StopIcon,
  Sun03Icon,
  UserAdd01Icon,
} from "@hugeicons/core-free-icons";

import { cn } from "@/lib/utils";

const icons = {
  add: Add01Icon,
  alert: AlertCircleIcon,
  audio: FileAudioIcon,
  calendar: Calendar03Icon,
  copy: Copy01Icon,
  dashboard: DashboardSquare01Icon,
  delete: Delete02Icon,
  folder: FolderOpenIcon,
  home: Home05Icon,
  lock: AiLockIcon,
  login: Login03Icon,
  logout: Logout03Icon,
  mail: AiMailIcon,
  mic: AiMicIcon,
  moon: Moon02Icon,
  more: MoreHorizontalIcon,
  refresh: Refresh03Icon,
  signup: UserAdd01Icon,
  stop: StopIcon,
  sun: Sun03Icon,
  upload: FileUploadIcon,
  wave: AudioWave01Icon,
} satisfies Record<string, IconSvgElement>;

export type AppIconName = keyof typeof icons;

export function AppIcon({
  name,
  className,
  size = 16,
}: {
  name: AppIconName;
  className?: string;
  size?: number;
}) {
  return (
    <HugeiconsIcon
      aria-hidden="true"
      className={cn("shrink-0", className)}
      color="currentColor"
      icon={icons[name]}
      size={size}
      strokeWidth={1.7}
    />
  );
}
