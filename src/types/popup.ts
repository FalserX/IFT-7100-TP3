export enum PopupType {
  CONFIRM = 0,
  INFO = 1,
  WARNING = 2,
  ERROR = 3,
}

export enum PopupHeaderColorType {
  CONFIRM = "bg-green-800",
  INFO = "bg-blue-800",
  WARNING = "bg-amber-800",
  ERROR = "bg-red-800",
}
export enum PopupButtonColorType {
  CONFIRM = "bg-green-600",
  INFO = "bg-blue-500",
  WARNING = "bg-amber-500",
  ERROR = "bg-red-500",
}

export enum PopupBorderColorType {
  CONFIRM = "border-green-700",
  INFO = "border-blue-600",
  WARNING = "border-amber-700",
  ERROR = "border-red-950",
}

export enum PopupImageType {
  CONFIRM = "/Info.svg",
  // eslint-disable-next-line @typescript-eslint/no-duplicate-enum-values
  INFO = "/Info.svg",
  WARNING = "/Warning.svg",
  ERROR = "/Error.svg",
}

export enum PopupImageAltType {
  CONFIRM = "notif.img-error-alt",
  INFO = "notif.img-info-alt",
  WARNING = "notif-img-warning-alt",
  ERROR = "notif-img-error-alt",
}

export const getImageAltPopupType: Record<PopupType, PopupImageAltType> = {
  [PopupType.CONFIRM]: PopupImageAltType.CONFIRM,
  [PopupType.ERROR]: PopupImageAltType.ERROR,
  [PopupType.INFO]: PopupImageAltType.INFO,
  [PopupType.WARNING]: PopupImageAltType.WARNING,
};

export const getImagePopupType: Record<PopupType, PopupImageType> = {
  [PopupType.CONFIRM]: PopupImageType.CONFIRM,
  [PopupType.ERROR]: PopupImageType.ERROR,
  [PopupType.INFO]: PopupImageType.INFO,
  [PopupType.WARNING]: PopupImageType.WARNING,
};
export const getColorHeaderPopupType: Record<PopupType, PopupHeaderColorType> =
  {
    [PopupType.CONFIRM]: PopupHeaderColorType.CONFIRM,
    [PopupType.ERROR]: PopupHeaderColorType.ERROR,
    [PopupType.INFO]: PopupHeaderColorType.INFO,
    [PopupType.WARNING]: PopupHeaderColorType.WARNING,
  };
export const getColorBorderPopupType: Record<PopupType, PopupBorderColorType> =
  {
    [PopupType.CONFIRM]: PopupBorderColorType.CONFIRM,
    [PopupType.ERROR]: PopupBorderColorType.ERROR,
    [PopupType.INFO]: PopupBorderColorType.INFO,
    [PopupType.WARNING]: PopupBorderColorType.WARNING,
  };
export const getColorButtonPopupType: Record<PopupType, PopupButtonColorType> =
  {
    [PopupType.CONFIRM]: PopupButtonColorType.CONFIRM,
    [PopupType.ERROR]: PopupButtonColorType.ERROR,
    [PopupType.INFO]: PopupButtonColorType.INFO,
    [PopupType.WARNING]: PopupButtonColorType.WARNING,
  };
