"use client";

import { useMemo, useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import {
  Banknote,
  Cake,
  CheckCircle2,
  CreditCard,
  Gem,
  Heart,
  PartyPopper,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import { AvailabilityCalendar } from "@/modules/vendors/components/availability-calendar";
import { cityLabel } from "@/modules/vendors/lib/city-label";
import type { VendorView } from "@/modules/vendors/types/vendor";
import {
  formatDateKey,
  isBeforeMinBookableDate,
  minBookableDate,
} from "@/modules/vendors/lib/booking-notice";
import {
  WALLET_PROVIDERS,
  cardholderOk,
  cvcOk,
  digitsOnly,
  expiryOk,
  formatCardNumber,
  formatExpiry,
  luhnOk,
  walletPhoneOk,
  type WalletProvider,
} from "@/modules/payments";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { type Dictionary, type Locale, localizedPath } from "@/shared/lib/i18n";
import { cn, formatPrice, localized } from "@/shared/lib/utils";
import { submitBookingRequest } from "../services/actions";
import {
  EVENT_TYPES,
  PAYMENT_METHODS,
  safeParseBookingRequest,
  type EventTypeInput,
  type PaymentMethod,
} from "../services/booking-schema";

type BookingCheckoutProps = {
  vendor: VendorView;
  locale: Locale;
  dictionary: Dictionary;
  initialDate?: string;
};

type FormValues = {
  eventDate: string;
  eventType: EventTypeInput;
  packageId: string;
  paymentMethod: PaymentMethod;
  notes: string;
  cardName: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
  walletProvider: WalletProvider;
  walletPhone: string;
};

const PAYMENT_ICONS = {
  card: CreditCard,
  wallet: Wallet,
  venue: Banknote,
} as const;

const EVENT_TYPE_ICONS = {
  wedding: Heart,
  engagement: Gem,
  birthday: Cake,
  general: PartyPopper,
} as const;

const WALLET_LOGOS: Record<WalletProvider, string> = {
  instapay: "/payment/instapay.jpg",
  vodafone: "/payment/vodafone-cash.png",
  orange: "/payment/orange-cash.png",
  etisalat: "/payment/etisalat-cash.png",
};

export function BookingCheckout({
  vendor,
  locale,
  dictionary,
  initialDate,
}: BookingCheckoutProps) {
  const copy = dictionary.booking;
  const [step, setStep] = useState<1 | 2>(1);
  const [error, setError] = useState<"invalid" | "date-unavailable" | "failed" | "payment" | null>(
    null,
  );
  const [done, setDone] = useState(false);
  const [pending, startTransition] = useTransition();
  const minDate = minBookableDate();
  const booked = useMemo(() => new Set(vendor.bookedDates), [vendor.bookedDates]);
  const defaultDate =
    initialDate && !isBeforeMinBookableDate(initialDate) && !booked.has(initialDate)
      ? initialDate
      : minDate;

  const form = useForm<FormValues>({
    defaultValues: {
      eventDate: defaultDate,
      eventType: "wedding",
      packageId: vendor.packages[0]?.id ?? "",
      paymentMethod: "card",
      notes: "",
      cardName: "",
      cardNumber: "",
      cardExpiry: "",
      cardCvc: "",
      walletProvider: "instapay",
      walletPhone: "",
    },
  });

  const eventDate = form.watch("eventDate");
  const eventType = form.watch("eventType");
  const packageId = form.watch("packageId");
  const paymentMethod = form.watch("paymentMethod");
  const walletProvider = form.watch("walletProvider");
  const selectedPackage = vendor.packages.find((item) => item.id === packageId);
  const total = selectedPackage?.price ?? vendor.startingPrice;
  const name = localized(vendor.name, locale);
  const needsPaymentDetails = paymentMethod !== "venue";

  function bookingPayload(values: FormValues) {
    const last4 = digitsOnly(values.cardNumber).slice(-4);
    return {
      vendorId: vendor.id,
      eventDate: values.eventDate,
      eventType: values.eventType,
      packageId: values.packageId || undefined,
      paymentMethod: values.paymentMethod,
      notes: values.notes || undefined,
      walletProvider: values.paymentMethod === "wallet" ? values.walletProvider : undefined,
      walletPhone: values.paymentMethod === "wallet" ? values.walletPhone : undefined,
      cardLast4: values.paymentMethod === "card" && last4.length === 4 ? last4 : undefined,
    };
  }

  function send(values: FormValues) {
    const parsed = safeParseBookingRequest(bookingPayload(values));
    if (!parsed.success) {
      setError("invalid");
      return;
    }
    if (booked.has(parsed.data.eventDate)) {
      setError("date-unavailable");
      return;
    }

    setError(null);
    startTransition(async () => {
      const result = await submitBookingRequest(parsed.data, locale);
      if (!result.ok) {
        setError(result.reason === "date-unavailable" ? "date-unavailable" : "failed");
        return;
      }
      setDone(true);
    });
  }

  function onContinue() {
    const values = form.getValues();
    if (!values.eventDate || booked.has(values.eventDate) || isBeforeMinBookableDate(values.eventDate)) {
      setError("date-unavailable");
      return;
    }
    setError(null);
    if (!needsPaymentDetails) {
      send(values);
      return;
    }
    setStep(2);
  }

  function onPay(values: FormValues) {
    if (values.paymentMethod === "card") {
      const validCard =
        cardholderOk(values.cardName) &&
        luhnOk(values.cardNumber) &&
        expiryOk(values.cardExpiry) &&
        cvcOk(values.cardCvc);
      if (!validCard) {
        setError("payment");
        return;
      }
    }
    if (values.paymentMethod === "wallet" && !walletPhoneOk(values.walletPhone)) {
      setError("payment");
      return;
    }
    send(values);
  }

  if (done) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl bg-card p-8 text-center shadow-soft">
        <span className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-gold/15 text-gold">
          <CheckCircle2 className="size-7" aria-hidden />
        </span>
        <h1 className="font-heading text-2xl">{copy.successTitle}</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {paymentMethod === "venue" ? copy.successBody : copy.successPayBody}
        </p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button asChild>
            <Link href={localizedPath(locale, "/dashboard/bookings")}>{copy.viewBookings}</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={localizedPath(locale, `/vendors/${vendor.category}/${vendor.id}`)}>
              {copy.backToVendor}
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const errorMessage =
    error === "date-unavailable"
      ? copy.dateUnavailable
      : error === "payment"
        ? copy.paymentInvalid
        : error === "invalid"
          ? copy.invalid
          : error === "failed"
            ? copy.failed
            : null;

  return (
    <form
      onSubmit={form.handleSubmit(step === 1 ? () => onContinue() : onPay)}
      className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start"
    >
      <div className="space-y-6">
        <header className="space-y-3">
          <p className="text-sm font-medium tracking-wide text-gold">{name}</p>
          <h1 className="font-heading text-3xl">{copy.title}</h1>
          <p className="text-sm text-muted-foreground">{copy.subtitle}</p>
          {needsPaymentDetails ? (
            <ol className="flex items-center gap-2 text-xs font-medium">
              <li
                aria-current={step === 1 ? "step" : undefined}
                className={cn("rounded-full px-3 py-1", step === 1 ? "bg-gold text-gold-foreground" : "bg-muted")}
              >
                1. {copy.stepBooking}
              </li>
              <li className="text-muted-foreground" aria-hidden>
                →
              </li>
              <li
                aria-current={step === 2 ? "step" : undefined}
                className={cn("rounded-full px-3 py-1", step === 2 ? "bg-gold text-gold-foreground" : "bg-muted")}
              >
                2. {copy.stepPayment}
              </li>
            </ol>
          ) : null}
        </header>

        {step === 1 ? (
          <>
            <section className="space-y-3 rounded-2xl bg-card p-4 shadow-soft sm:p-5">
              <h2 className="font-heading text-lg">{copy.eventDate}</h2>
              <p className="text-xs text-muted-foreground">
                {copy.notice.replace("{date}", formatDateKey(minDate, locale))}
              </p>
              <AvailabilityCalendar
                bookedDates={vendor.bookedDates}
                locale={locale}
                dictionary={dictionary}
                selectedDate={eventDate}
                onSelectDate={(date) => form.setValue("eventDate", date, { shouldValidate: true })}
              />
            </section>

            <section className="space-y-3 rounded-2xl bg-card p-4 shadow-soft sm:p-5">
              <Label htmlFor="eventType" className="font-heading text-lg">
                {copy.eventType}
              </Label>
              <Select
                value={eventType}
                onValueChange={(value) =>
                  form.setValue("eventType", value as EventTypeInput, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
              >
                <SelectTrigger id="eventType" size="lg" className="w-full bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent position="popper" align="start" className="w-(--radix-select-trigger-width)">
                  {EVENT_TYPES.map((type) => {
                    const Icon = EVENT_TYPE_ICONS[type];
                    return (
                      <SelectItem key={type} value={type}>
                        <Icon className="size-4 text-gold" aria-hidden />
                        {copy.eventTypes[type]}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </section>

            <section className="space-y-3 rounded-2xl bg-card p-4 shadow-soft sm:p-5">
              <h2 className="font-heading text-lg">{copy.package}</h2>
              <div className="grid gap-2">
                {(vendor.packages.length > 0
                  ? vendor.packages
                  : [
                      {
                        id: "",
                        name: { ar: copy.startingPackage, en: copy.startingPackage },
                        price: vendor.startingPrice,
                        unit: "event" as const,
                        details: vendor.description,
                      },
                    ]
                ).map((item) => {
                  const checked = packageId === item.id || (!item.id && !packageId);
                  return (
                    <label
                      key={item.id || "standard"}
                      className={cn(
                        "flex cursor-pointer items-start justify-between gap-3 rounded-xl border p-3 transition",
                        checked ? "border-gold bg-gold/5" : "border-border hover:border-gold/50",
                      )}
                    >
                      <span className="flex items-start gap-3">
                        <input
                          type="radio"
                          value={item.id}
                          className="mt-1 accent-[var(--gold)]"
                          {...form.register("packageId")}
                        />
                        <span>
                          <span className="block text-sm font-medium">{localized(item.name, locale)}</span>
                          <span className="mt-0.5 block text-xs text-muted-foreground">
                            {localized(item.details, locale)}
                          </span>
                        </span>
                      </span>
                      <span className="shrink-0 text-sm font-medium">{formatPrice(item.price, locale)}</span>
                    </label>
                  );
                })}
              </div>
            </section>

            <section className="space-y-3 rounded-2xl bg-card p-4 shadow-soft sm:p-5">
              <h2 className="font-heading text-lg">{copy.payment}</h2>
              <div className="grid gap-2">
                {PAYMENT_METHODS.map((method) => {
                  const Icon = PAYMENT_ICONS[method];
                  const checked = paymentMethod === method;
                  return (
                    <label
                      key={method}
                      className={cn(
                        "flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition",
                        checked ? "border-gold bg-gold/5" : "border-border hover:border-gold/50",
                      )}
                    >
                      <input
                        type="radio"
                        value={method}
                        className="mt-1 accent-[var(--gold)]"
                        {...form.register("paymentMethod")}
                      />
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold">
                        <Icon className="size-4" aria-hidden />
                      </span>
                      <span>
                        <span className="block text-sm font-medium">{copy.methods[method].title}</span>
                        <span className="mt-0.5 block text-xs text-muted-foreground">
                          {copy.methods[method].hint}
                        </span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </section>

            <section className="space-y-2 rounded-2xl bg-card p-4 shadow-soft sm:p-5">
              <Label htmlFor="notes">{copy.notes}</Label>
              <textarea
                id="notes"
                rows={4}
                placeholder={copy.notesPlaceholder}
                className="w-full resize-none rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm"
                {...form.register("notes")}
              />
            </section>
          </>
        ) : paymentMethod === "card" ? (
          <section className="space-y-4 rounded-2xl bg-card p-4 shadow-soft sm:p-5">
            <h2 className="font-heading text-lg">{copy.methods.card.title}</h2>
            <div className="space-y-2">
              <Label htmlFor="cardName">{copy.cardName}</Label>
              <Input id="cardName" autoComplete="cc-name" required {...form.register("cardName")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cardNumber">{copy.cardNumber}</Label>
              <Input
                id="cardNumber"
                inputMode="numeric"
                autoComplete="cc-number"
                placeholder={copy.cardNumberPlaceholder}
                required
                value={form.watch("cardNumber")}
                onChange={(event) => form.setValue("cardNumber", formatCardNumber(event.target.value))}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="cardExpiry">{copy.cardExpiry}</Label>
                <Input
                  id="cardExpiry"
                  inputMode="numeric"
                  autoComplete="cc-exp"
                  placeholder={copy.cardExpiryPlaceholder}
                  required
                  value={form.watch("cardExpiry")}
                  onChange={(event) => form.setValue("cardExpiry", formatExpiry(event.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cardCvc">{copy.cardCvc}</Label>
                <Input
                  id="cardCvc"
                  inputMode="numeric"
                  autoComplete="cc-csc"
                  maxLength={4}
                  required
                  value={form.watch("cardCvc")}
                  onChange={(event) =>
                    form.setValue("cardCvc", digitsOnly(event.target.value).slice(0, 4))
                  }
                />
              </div>
            </div>
          </section>
        ) : (
          <section className="space-y-4 rounded-2xl bg-card p-4 shadow-soft sm:p-5">
            <h2 className="font-heading text-lg">{copy.methods.wallet.title}</h2>
            <div className="space-y-2">
              <Label htmlFor="walletProvider">{copy.walletProvider}</Label>
              <Select
                value={walletProvider}
                onValueChange={(value) =>
                  form.setValue("walletProvider", value as WalletProvider, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
              >
                <SelectTrigger id="walletProvider" size="lg" className="w-full bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent position="popper" align="start" className="w-(--radix-select-trigger-width)">
                  {WALLET_PROVIDERS.map((provider) => (
                    <SelectItem key={provider} value={provider}>
                      <img
                        src={WALLET_LOGOS[provider]}
                        alt=""
                        width={32}
                        height={24}
                        className="h-6 w-8 shrink-0 rounded-sm object-contain"
                      />
                      {copy.wallets[provider]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="walletPhone">{copy.walletPhone}</Label>
              <Input
                id="walletPhone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder={copy.walletPhonePlaceholder}
                required
                {...form.register("walletPhone")}
              />
            </div>
          </section>
        )}
      </div>

      <aside className="lg:sticky lg:top-24">
        <div className="rounded-2xl bg-card p-5 shadow-lift">
          <div className="flex gap-3">
            <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-muted">
              <Image src={vendor.coverImage} alt="" fill className="object-cover" sizes="64px" />
            </div>
            <div className="min-w-0">
              <p className="truncate font-medium">{name}</p>
              <p className="text-xs text-muted-foreground">
                {dictionary.categories[vendor.category].title} · {cityLabel(vendor.city, dictionary)}
              </p>
            </div>
          </div>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">{copy.eventDate}</dt>
              <dd className="text-end font-medium">{formatDateKey(eventDate, locale)}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">{copy.eventType}</dt>
              <dd className="text-end font-medium">{copy.eventTypes[eventType]}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">{copy.package}</dt>
              <dd className="text-end font-medium">
                {selectedPackage ? localized(selectedPackage.name, locale) : copy.startingPackage}
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">{copy.payment}</dt>
              <dd className="text-end font-medium">{copy.methods[paymentMethod].title}</dd>
            </div>
            <div className="flex justify-between gap-3 border-t border-border pt-3">
              <dt className="text-muted-foreground">{copy.total}</dt>
              <dd className="font-heading text-xl">{formatPrice(total, locale)}</dd>
            </div>
          </dl>
          {errorMessage ? <p className="mt-3 text-sm text-destructive">{errorMessage}</p> : null}
          {step === 2 ? (
            <Button
              type="button"
              variant="outline"
              className="mt-4 w-full"
              onClick={() => {
                setError(null);
                setStep(1);
              }}
            >
              {copy.back}
            </Button>
          ) : null}
          <Button type="submit" size="xl" className="mt-3 w-full" disabled={pending}>
            {step === 1
              ? needsPaymentDetails
                ? copy.submitPay
                : copy.submit
              : copy.payAmount.replace("{amount}", formatPrice(total, locale))}
          </Button>
          <p className="mt-3 inline-flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
            <ShieldCheck className="size-3.5 text-gold" aria-hidden />
            {copy.secure}
          </p>
        </div>
      </aside>
    </form>
  );
}
