-- Add new vendor_category enum values. Run in the Supabase SQL editor.
-- Safe to re-run (IF NOT EXISTS). New values cannot be used in the same transaction
-- that adds them; run this script on its own, then insert vendors.

alter type public.vendor_category add value if not exists 'bachelorette';
alter type public.vendor_category add value if not exists 'beauty-nails';
alter type public.vendor_category add value if not exists 'dj';
alter type public.vendor_category add value if not exists 'entertainment';
alter type public.vendor_category add value if not exists 'favours-products';
alter type public.vendor_category add value if not exists 'florist';
alter type public.vendor_category add value if not exists 'hairdresser';
alter type public.vendor_category add value if not exists 'honeymoon';
alter type public.vendor_category add value if not exists 'media-coverage';
alter type public.vendor_category add value if not exists 'officiant';
alter type public.vendor_category add value if not exists 'room-decoration';
alter type public.vendor_category add value if not exists 'transportation';
alter type public.vendor_category add value if not exists 'veil-designer';
alter type public.vendor_category add value if not exists 'videographer';
alter type public.vendor_category add value if not exists 'wedding-cake';
