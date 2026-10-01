export type JamalMessageRole = "user" | "assistant";

export interface JamalHistoryMessage {
  role: JamalMessageRole;
  content: string;
}

export type JamalRouteId =
  | "hub"
  | "operations"
  | "capabilities"
  | "communications"
  | "personnel"
  | "projects"
  | "project-nexa"
  | "project-atmos-fc";

export type JamalContactActionId =
  | "contact-email"
  | "contact-phone"
  | "contact-linkedin"
  | "contact-github"
  | "contact-resume";

export type JamalLinkId = JamalRouteId | JamalContactActionId;
export type JamalLinkKind = "internal" | "email" | "phone" | "external" | "document";
export type JamalLinkIcon =
  | "hub"
  | "operations"
  | "capabilities"
  | "communications"
  | "personnel"
  | "projects"
  | "mail"
  | "call"
  | "linkedin"
  | "github"
  | "description";

export interface JamalLink {
  label: string;
  href: string;
  kind: JamalLinkKind;
  icon: JamalLinkIcon;
}

export interface JamalRequest {
  message: string;
  history: JamalHistoryMessage[];
  pathname: string;
}

export interface JamalSuccessResponse {
  answer: string;
  links: JamalLink[];
}

export type JamalErrorCode =
  | "disabled"
  | "invalid_request"
  | "unsafe_input"
  | "rate_limited"
  | "unavailable";

export interface JamalErrorResponse {
  error: {
    code: JamalErrorCode;
    message: string;
    retryAfterSeconds?: number;
  };
}

export type JamalApiResponse = JamalSuccessResponse | JamalErrorResponse;
