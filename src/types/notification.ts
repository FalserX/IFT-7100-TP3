export enum NotifType {
  ERROR = 0,
  INFO = 1,
  WARNING = 2,
  CONFIRM = 3,
}

export enum NotifColorType {
  ERROR = "bg-red-700",
  INFO = "bg-blue-700",
  WARNING = "bg-amber-700",
  CONFIRM = "bg-green-700",
}

export enum NotifImageType {
  ERROR = "/Error.svg",
  INFO = "/Info.svg",
  WARNING = "/Warning.svg",
  CONFIRM = "/Confirm.svg",
}

export enum NotifImageAltType {
  ERROR = "notif.img-error-alt",
  INFO = "notif.img-info-alt",
  WARNING = "notif.img-warning-alt",
  CONFIRM = "notif.img-confirm-alt",
}

export const getImageAltNotifType: Record<NotifType, NotifImageAltType> = {
  [NotifType.CONFIRM]: NotifImageAltType.CONFIRM,
  [NotifType.ERROR]: NotifImageAltType.ERROR,
  [NotifType.INFO]: NotifImageAltType.INFO,
  [NotifType.WARNING]: NotifImageAltType.WARNING,
};

export const getImageNotifType: Record<NotifType, NotifImageType> = {
  [NotifType.CONFIRM]: NotifImageType.CONFIRM,
  [NotifType.ERROR]: NotifImageType.ERROR,
  [NotifType.INFO]: NotifImageType.INFO,
  [NotifType.WARNING]: NotifImageType.WARNING,
};
export const getColorNotifType: Record<NotifType, NotifColorType> = {
  [NotifType.CONFIRM]: NotifColorType.CONFIRM,
  [NotifType.ERROR]: NotifColorType.ERROR,
  [NotifType.INFO]: NotifColorType.INFO,
  [NotifType.WARNING]: NotifColorType.WARNING,
};
