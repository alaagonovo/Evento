import { CalendarDays, Mail, Phone, Shield } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { type Dictionary, type Locale } from "@/shared/lib/i18n";
import { ProfilePhotoForm } from "./profile-photo-form";
import type { Profile } from "../services/profiles";

type ProfileViewProps = {
  profile: Profile;
  locale: Locale;
  dictionary: Dictionary;
};

function formatMemberSince(isoDate: string, locale: Locale) {
  return new Date(isoDate).toLocaleDateString(locale === "ar" ? "ar-EG" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function ProfileView({ profile, locale, dictionary }: ProfileViewProps) {
  const copy = dictionary.profile;
  const displayName = profile.fullName || profile.email.split("@")[0];
  const roleLabel = copy.roles[profile.role];

  const details = [
    { icon: Mail, label: copy.email, value: profile.email },
    { icon: Phone, label: copy.phone, value: profile.phone || copy.noPhone },
    { icon: Shield, label: copy.role, value: roleLabel },
    {
      icon: CalendarDays,
      label: copy.memberSince,
      value: formatMemberSince(profile.createdAt, locale),
    },
  ];

  return (
    <div className="space-y-6">
      <header className="max-w-2xl space-y-2">
        <h1 className="font-heading text-3xl sm:text-4xl">{copy.title}</h1>
        <p className="text-muted-foreground">{copy.subtitle}</p>
      </header>

      <Card>
        <CardHeader className="border-b">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <ProfilePhotoForm
              name={displayName}
              initialUrl={profile.avatarUrl}
              dictionary={dictionary}
            />
            <div className="min-w-0 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <CardTitle className="text-2xl">{displayName}</CardTitle>
                <Badge variant="gold">{roleLabel}</Badge>
              </div>
              <CardDescription>
                {profile.avatarUrl ? copy.photoReady : copy.photoMissing}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-5 sm:grid-cols-2">
            {details.map((item) => (
              <div key={item.label} className="flex gap-3">
                <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-gold">
                  <item.icon className="size-4" aria-hidden />
                </div>
                <div className="min-w-0">
                  <dt className="text-xs font-medium tracking-wide text-muted-foreground">
                    {item.label}
                  </dt>
                  <dd className="mt-1 truncate text-sm text-foreground">{item.value}</dd>
                </div>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}
