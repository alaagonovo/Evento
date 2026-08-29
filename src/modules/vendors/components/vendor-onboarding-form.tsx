"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import type { Dictionary, Locale } from "@/shared/lib/i18n";
import { CITY_SLUGS } from "../data/mock";
import { VENDOR_TYPE_TO_CATEGORY, VENDOR_TYPES } from "../types/category";
import { submitVendorOnboarding } from "../services/actions";
import {
  safeParseVendorOnboarding,
  type VendorOnboardingInput,
} from "../services/onboarding-schema";

type VendorOnboardingFormProps = {
  locale: Locale;
  dictionary: Dictionary;
};

type OnboardingFormValues = {
  businessName: string;
  category: VendorOnboardingInput["category"];
  city: string;
  address: string;
  description: string;
  coverImage: string;
  locationLink: string;
  priceStartingAt: number | "";
  galleryImages: string;
};

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-sm text-destructive">{message}</p>;
}

function RequiredLabel({ htmlFor, children }: { htmlFor: string; children: string }) {
  return (
    <Label htmlFor={htmlFor}>
      {children}
      <span aria-hidden="true" className="text-destructive">
        {" "}
        *
      </span>
    </Label>
  );
}

export function VendorOnboardingForm({ locale, dictionary }: VendorOnboardingFormProps) {
  const [error, setError] = useState(false);
  const [pending, startTransition] = useTransition();
  const form = useForm<OnboardingFormValues>({
    defaultValues: {
      businessName: "",
      category: "venue",
      city: "cairo",
      address: "",
      description: "",
      coverImage: "",
      locationLink: "",
      priceStartingAt: "",
      galleryImages: "",
    },
  });
  const copy = dictionary.onboarding;
  const errors = form.formState.errors;

  function onSubmit(values: OnboardingFormValues) {
    const parsed = safeParseVendorOnboarding(values);
    if (!parsed.success) {
      setError(true);
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if (typeof key === "string") {
          form.setError(key as keyof OnboardingFormValues, {
            type: "validate",
            message: copy.invalid,
          });
        }
      }
      return;
    }

    startTransition(async () => {
      const response = await submitVendorOnboarding(locale, values);
      if (response?.ok === false) {
        setError(true);
      }
    });
  }

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <div className="space-y-2">
        <RequiredLabel htmlFor="businessName">{copy.businessName}</RequiredLabel>
        <Input
          id="businessName"
          required
          minLength={2}
          {...form.register("businessName", { required: copy.required })}
        />
        <FieldError message={errors.businessName?.message} />
      </div>
      <div className="space-y-2">
        <RequiredLabel htmlFor="category">{copy.category}</RequiredLabel>
        <select
          id="category"
          required
          className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
          {...form.register("category", { required: copy.required })}
        >
          {VENDOR_TYPES.map((type) => (
            <option key={type} value={type}>
              {dictionary.categories[VENDOR_TYPE_TO_CATEGORY[type]].title}
            </option>
          ))}
        </select>
        <FieldError message={errors.category?.message} />
      </div>
      <div className="space-y-2">
        <RequiredLabel htmlFor="city">{copy.city}</RequiredLabel>
        <select
          id="city"
          required
          className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
          {...form.register("city", { required: copy.required })}
        >
          {CITY_SLUGS.map((slug) => (
            <option key={slug} value={slug}>
              {dictionary.cities[slug]}
            </option>
          ))}
        </select>
        <FieldError message={errors.city?.message} />
      </div>
      <div className="space-y-2">
        <RequiredLabel htmlFor="address">{copy.address}</RequiredLabel>
        <Input
          id="address"
          required
          minLength={4}
          {...form.register("address", { required: copy.required })}
        />
        <FieldError message={errors.address?.message} />
      </div>
      <div className="space-y-2">
        <RequiredLabel htmlFor="locationLink">{copy.locationLink}</RequiredLabel>
        <Input
          id="locationLink"
          type="url"
          required
          {...form.register("locationLink", { required: copy.required })}
        />
        <p className="text-xs text-muted-foreground">{copy.locationHint}</p>
        <FieldError message={errors.locationLink?.message} />
      </div>
      <div className="space-y-2">
        <RequiredLabel htmlFor="priceStartingAt">{copy.startingPrice}</RequiredLabel>
        <Input
          id="priceStartingAt"
          type="number"
          required
          min={1}
          step="1"
          {...form.register("priceStartingAt", {
            required: copy.required,
            valueAsNumber: true,
          })}
        />
        <FieldError message={errors.priceStartingAt?.message} />
      </div>
      <div className="space-y-2">
        <RequiredLabel htmlFor="description">{copy.description}</RequiredLabel>
        <textarea
          id="description"
          required
          minLength={20}
          rows={4}
          className="w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm"
          {...form.register("description", { required: copy.required })}
        />
        <FieldError message={errors.description?.message} />
      </div>
      <div className="space-y-2">
        <RequiredLabel htmlFor="coverImage">{copy.coverImage}</RequiredLabel>
        <Input
          id="coverImage"
          type="url"
          required
          {...form.register("coverImage", { required: copy.required })}
        />
        <FieldError message={errors.coverImage?.message} />
      </div>
      <div className="space-y-2">
        <RequiredLabel htmlFor="galleryImages">{copy.galleryImages}</RequiredLabel>
        <textarea
          id="galleryImages"
          required
          rows={4}
          className="w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm"
          placeholder={copy.galleryHint}
          {...form.register("galleryImages", { required: copy.required })}
        />
        <FieldError message={errors.galleryImages?.message} />
      </div>
      {error ? <p className="text-sm text-destructive">{copy.invalid}</p> : null}
      <Button type="submit" size="xl" className="w-full" disabled={pending}>
        {copy.submit}
      </Button>
    </form>
  );
}
