# EVLV Tiny

Standalone EVLV brand hub for sharing EVLV Peptides, EVLV Today, ZooNetics, reviews, contact details, and consultation booking.

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Deploy to Vercel

1. Import `Nikola0803/evlv-tiny` in Vercel.
2. Add a Neon Postgres integration to the Vercel project, or provide a `DATABASE_URL` environment variable.
3. For contact-form email delivery, add `RESEND_API_KEY` and a verified sender such as `CONTACT_FROM_EMAIL=EVLV Hub <contact@evlv.bio>`.
4. Deploy. The API creates the `bookings` and `contact_messages` tables automatically on first use.
5. Add `evlv.bio` under the Vercel project's Domains section only if Vercel, rather than ChatGPT Sites, should own that domain.

Without `DATABASE_URL`, the visual hub still renders, but booking and contact submissions return a configuration message. Direct email and phone links remain available.
