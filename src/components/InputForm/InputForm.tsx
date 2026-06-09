'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { useSajuStore } from '@/lib/store';
import { fadeUp, staggerContainer } from '@/styles/animations';
import * as s from './InputForm.css';

const MIN_BIRTH_YEAR = 1900;
const TODAY = new Date();
const CURRENT_YEAR = TODAY.getFullYear();
const TODAY_ISO = TODAY.toISOString().slice(0, 10);

const MONTHS = [
  { value: '01', label: 'January' },
  { value: '02', label: 'February' },
  { value: '03', label: 'March' },
  { value: '04', label: 'April' },
  { value: '05', label: 'May' },
  { value: '06', label: 'June' },
  { value: '07', label: 'July' },
  { value: '08', label: 'August' },
  { value: '09', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
] as const;

const DAYS = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));

/* The 12 Earthly Branches (12간지) hour ranges — each spans two hours
   and is offset by 30 minutes from clock-hour boundaries to match the
   standard Korean saju convention. Korean labels (자시/축시/…) are
   intentionally omitted because the UI is English-only; the time range
   itself is unambiguous.

   The form value is the midpoint of each range (e.g. 00:30 for 23:30–
   01:30) which falls cleanly inside the calculator's HOUR_TO_BRANCH_INDEX
   bucketing — no extra calculation needed server-side. */
const TIME_RANGES = [
  { value: '00:30', label: '23:30 – 01:30' },
  { value: '02:30', label: '01:30 – 03:30' },
  { value: '04:30', label: '03:30 – 05:30' },
  { value: '06:30', label: '05:30 – 07:30' },
  { value: '08:30', label: '07:30 – 09:30' },
  { value: '10:30', label: '09:30 – 11:30' },
  { value: '12:30', label: '11:30 – 13:30' },
  { value: '14:30', label: '13:30 – 15:30' },
  { value: '16:30', label: '15:30 – 17:30' },
  { value: '18:30', label: '17:30 – 19:30' },
  { value: '20:30', label: '19:30 – 21:30' },
  { value: '22:30', label: '21:30 – 23:30' },
] as const;

function pad2(value: string | undefined): string {
  if (!value) return '';
  return value.padStart(2, '0');
}

/* Block characters that <input type="number"> still allows by default
   (e/E for exponent, +/- for sign, . for decimal). Digits, navigation, and
   ctrl/cmd shortcuts pass through. */
const ALLOWED_NON_DIGIT_KEYS = new Set([
  'Backspace',
  'Delete',
  'Tab',
  'Enter',
  'ArrowLeft',
  'ArrowRight',
  'ArrowUp',
  'ArrowDown',
  'Home',
  'End',
]);

function blockNonNumericKey(e: React.KeyboardEvent<HTMLInputElement>): void {
  if (e.metaKey || e.ctrlKey) return; // allow copy/paste/select-all
  if (ALLOWED_NON_DIGIT_KEYS.has(e.key)) return;
  if (!/^\d$/.test(e.key)) e.preventDefault();
}

/* Reject paste contents that aren't purely digits. */
function blockNonNumericPaste(e: React.ClipboardEvent<HTMLInputElement>): void {
  const text = e.clipboardData.getData('text');
  if (!/^\d+$/.test(text)) e.preventDefault();
}

const schema = z
  .object({
    name: z.string().min(1, 'Please enter your name'),
    birthMonth: z.string().min(1, 'Month is required'),
    birthDay: z.string().min(1, 'Day is required'),
    birthYear: z
      .string()
      .min(1, 'Year is required')
      .regex(/^\d{4}$/, 'Year must be 4 digits'),
    /* birthTime is optional. When provided, it's one of the 12 midpoint
       strings from TIME_RANGES — validated server-side anyway by the
       saju calculator's hour-parsing fallback. */
    birthTime: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const year = Number(data.birthYear);
    const month = Number(data.birthMonth);
    const day = Number(data.birthDay);

    if (year < MIN_BIRTH_YEAR || year > CURRENT_YEAR) {
      ctx.addIssue({
        code: 'custom',
        path: ['birthYear'],
        message: `Year must be between ${MIN_BIRTH_YEAR} and ${CURRENT_YEAR}`,
      });
      return;
    }

    if (Number.isFinite(year) && Number.isFinite(month) && Number.isFinite(day)) {
      const date = new Date(year, month - 1, day);
      if (
        date.getFullYear() !== year ||
        date.getMonth() !== month - 1 ||
        date.getDate() !== day
      ) {
        ctx.addIssue({
          code: 'custom',
          path: ['birthDay'],
          message: 'Please enter a valid date',
        });
        return;
      }

      const iso = `${data.birthYear}-${pad2(data.birthMonth)}-${pad2(data.birthDay)}`;
      if (iso > TODAY_ISO) {
        ctx.addIssue({
          code: 'custom',
          path: ['birthYear'],
          message: "Birth date can't be in the future",
        });
        return;
      }
    }
  });

type FormData = z.infer<typeof schema>;

export function InputForm() {
  const { setInput, fetchSaju, isLoadingChart, error } = useSajuStore();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      birthMonth: '',
      birthDay: '',
      birthYear: '',
      birthTime: '',
    },
  });

  /* Year input: strip non-digits, enforce 4-digit max length, clamp to
     CURRENT_YEAR. setValue keeps RHF state in sync with the DOM. */
  const clampYear = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 4) val = val.slice(0, 4);
    if (val !== '' && Number(val) > CURRENT_YEAR) val = String(CURRENT_YEAR);
    if (val !== e.target.value) {
      e.target.value = val;
      setValue('birthYear', val, { shouldValidate: false });
    }
  };

  const onSubmit = async (data: FormData) => {
    const birthDate = `${data.birthYear}-${pad2(data.birthMonth)}-${pad2(data.birthDay)}`;
    const birthTime = data.birthTime && data.birthTime !== '' ? data.birthTime : null;
    setInput(data.name, birthDate, birthTime);
    await fetchSaju();
  };

  const dateError =
    errors.birthMonth?.message ||
    errors.birthDay?.message ||
    errors.birthYear?.message;

  return (
    <motion.section
      className={s.section}
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      aria-labelledby="saju-heading"
    >
      <motion.header className={s.heroHeader} variants={fadeUp}>
        <p className={s.eyebrow}>四柱命理 · Four Pillars of Destiny</p>

        <h1 id="saju-heading" className={s.heading}>
          Discover your destiny through{' '}
          <span className={s.headingAccent}>Korean astrology</span>
        </h1>

        <p className={s.subtitle}>
          Saju reveals your elemental nature using the Four Pillars — an ancient
          system that reads the cosmic energy of your birth.
        </p>
      </motion.header>

      <motion.form
        className={s.formCard}
        onSubmit={handleSubmit(onSubmit)}
        variants={fadeUp}
        noValidate
      >
        <div className={s.fieldGroup}>
          <label className={s.fieldLabel}>
            <span className={s.fieldLabelText}>Name</span>
            <input
              className={s.fieldInput}
              placeholder="Your name"
              autoComplete="off"
              aria-invalid={errors.name ? true : undefined}
              {...register('name')}
            />
          </label>
          {errors.name && (
            <p className={s.fieldError} role="alert">
              {errors.name.message}
            </p>
          )}
        </div>

        <fieldset className={s.fieldset}>
          <legend className={s.fieldLabelText}>Date of birth</legend>
          <div className={s.dateRow}>
            <select
              className={s.fieldSelect}
              aria-label="Day"
              aria-invalid={errors.birthDay ? true : undefined}
              {...register('birthDay')}
            >
              <option value="">Day</option>
              {DAYS.map((d) => (
                <option key={d} value={d}>
                  {Number(d)}
                </option>
              ))}
            </select>
            <select
              className={s.fieldSelect}
              aria-label="Month"
              aria-invalid={errors.birthMonth ? true : undefined}
              {...register('birthMonth')}
            >
              <option value="">Month</option>
              {MONTHS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
            <input
              type="number"
              inputMode="numeric"
              step={1}
              className={s.fieldInput}
              placeholder="Year"
              aria-label="Year"
              min={MIN_BIRTH_YEAR}
              max={CURRENT_YEAR}
              onKeyDown={blockNonNumericKey}
              onPaste={blockNonNumericPaste}
              aria-invalid={errors.birthYear ? true : undefined}
              {...register('birthYear', { onChange: clampYear })}
            />
          </div>
          {dateError && (
            <p className={s.fieldError} role="alert">
              {dateError}
            </p>
          )}
        </fieldset>

        <div className={s.fieldGroup}>
          <label className={s.fieldLabel}>
            <span className={s.fieldLabelText}>
              Time of birth <span className={s.fieldOptional}>(optional)</span>
            </span>
            <select
              className={s.fieldSelect}
              aria-label="Time of birth"
              {...register('birthTime')}
            >
              <option value="">Select time range</option>
              {TIME_RANGES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <button type="submit" className={s.submitButton} disabled={isLoadingChart}>
          {isLoadingChart ? 'Reading your chart…' : 'Reveal my destiny'}
        </button>
        {error && (
          <p className={s.fieldError} role="alert">
            {error}
          </p>
        )}
      </motion.form>

      <motion.small className={s.footnote} variants={fadeUp}>
        Your birth details are processed to create this reading and are not
        stored by Elemental-U during the free beta.
      </motion.small>
    </motion.section>
  );
}
