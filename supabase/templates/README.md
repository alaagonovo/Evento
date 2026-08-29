# Evento auth emails

Supabase still sends confirmation and password-reset mail. These HTML files replace the default Supabase copy so the message looks like Evento. Changing the **From** name and address requires custom SMTP — templates alone are not enough.

## 1. Sender (required for “from Evento”)

1. Add and verify a domain with an SMTP provider (Resend, Postmark, SendGrid, Amazon SES, …).
2. In the [SMTP settings](https://supabase.com/dashboard/project/_/auth/smtp) page, enable **Custom SMTP**.
3. Set:
   - **Sender name:** `Evento`
   - **Sender email:** `noreply@your-evento-domain` (must match the verified domain)
   - Host, port (`587`), username, and password from the provider

Until this is saved, inboxes will still show `supabase.io` / Supabase Auth as the sender, even with custom templates.

## 2. Templates

Open [Email Templates](https://supabase.com/dashboard/project/_/auth/templates). Paste the HTML and subjects below. Keep `{{ .ConfirmationURL }}` intact.

### Confirm signup

- **Subject:** `{{ if eq .Data.locale "en" }}Confirm your Evento account{{ else }}أكّدي حسابك على Evento{{ end }}`
- **Body:** `confirmation.html`

### Reset password

- **Subject:** `{{ if eq .Data.locale "en" }}Reset your Evento password{{ else }}إعادة تعيين كلمة المرور على Evento{{ end }}`
- **Body:** `recovery.html`

Arabic is the default. English is used when signup stored `locale=en` in user metadata.

## 3. Check

Sign up with a new address and request a password reset. Confirm:

- From: `Evento <noreply@your-domain>`
- Subject and body match the templates
- The button opens the Evento confirmation / update-password flow
