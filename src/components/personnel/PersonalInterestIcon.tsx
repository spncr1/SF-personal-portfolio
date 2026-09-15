import type { PersonalInterestIcon as PersonalInterestIconName } from "@/data/profile";
import { SiteIcon, type SiteIconName } from "@/components/ui/SiteIcon";

interface PersonalInterestIconProps {
  icon: PersonalInterestIconName;
}

export function PersonalInterestIcon({ icon }: PersonalInterestIconProps) {
  const iconNames: Record<PersonalInterestIconName, SiteIconName> = {
    football: "soccer",
    gym: "fitness",
    music: "music-note",
    drawing: "draw",
  };

  return <SiteIcon name={iconNames[icon]} />;
}
