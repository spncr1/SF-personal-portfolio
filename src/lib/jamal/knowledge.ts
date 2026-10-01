import "server-only";

import { capabilities } from "@/data/capabilities";
import { contactChannels } from "@/data/contact";
import { jamalFaq } from "@/data/jamalFaq";
import { activeOperations } from "@/data/operations";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { JAMAL_CONTACT_ACTIONS, JAMAL_ROUTES } from "./context";

export interface JamalKnowledgeSnapshot {
  profile: {
    name: string;
    title: string;
    education: string;
    summary: string;
    experience: string[];
    serviceLog: typeof profile.serviceLog;
    careerDirection: string;
    technicalInterests: string[];
    personalInterests: typeof profile.personalInterests;
  };
  projects: Array<{
    slug: string;
    title: string;
    description: string;
    category: string;
    stack: string[];
    problemSolved: string;
    architectureSummary: string;
    keyFeatures: string[];
    timeline: string;
  }>;
  capabilities: typeof capabilities;
  activeOperations: Array<{
    id: string;
    code: string;
    name: string;
    status: string;
    phase: string;
    currentThinking: string;
  }>;
  contact: Array<{
    label: string;
    value: string;
    actionId: string;
  }>;
  routes: Array<{
    id: string;
    label: string;
    href: string;
    description: string;
  }>;
  contactActions: Array<{
    id: string;
    label: string;
    description: string;
  }>;
  approvedFaq: typeof jamalFaq;
}

export function getJamalKnowledge(): JamalKnowledgeSnapshot {
  return {
    profile: {
      name: profile.name,
      title: profile.title,
      education: profile.education,
      summary: profile.summary,
      experience: profile.experience,
      serviceLog: profile.serviceLog,
      careerDirection: profile.careerDirection,
      technicalInterests: profile.technicalInterests,
      personalInterests: profile.personalInterests,
    },
    projects: projects.map((project) => ({
      slug: project.slug,
      title: project.title,
      description: project.description,
      category: project.category,
      stack: project.stack,
      problemSolved: project.problemSolved,
      architectureSummary: project.architectureSummary,
      keyFeatures: project.keyFeatures,
      timeline: project.timeline,
    })),
    capabilities,
    activeOperations: activeOperations.map((operation) => ({
      id: operation.id,
      code: operation.code,
      name: operation.name,
      status: operation.status,
      phase: operation.phase,
      currentThinking: operation.currentThinking,
    })),
    contact: contactChannels.map((channel) => ({
      label: channel.label,
      value: channel.value,
      actionId: `contact-${channel.id}`,
    })),
    routes: JAMAL_ROUTES.map(({ id, label, href, description }) => ({
      id,
      label,
      href,
      description,
    })),
    contactActions: JAMAL_CONTACT_ACTIONS.map(({ id, label, description }) => ({
      id,
      label,
      description,
    })),
    approvedFaq: jamalFaq,
  };
}
